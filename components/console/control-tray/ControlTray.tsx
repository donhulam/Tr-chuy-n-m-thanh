/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cn from 'classnames';

import { memo, ReactNode, useEffect, useRef, useState, ChangeEvent } from 'react';
import { AudioRecorder } from '../../../lib/audio-recorder';
import { useSettings, useLogStore } from '@/lib/state';

import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';

export type ControlTrayProps = {
  children?: ReactNode;
};

function ControlTray({ children }: ControlTrayProps) {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const { documentContext, setDocumentContext } = useSettings();


  useEffect(() => {
    // FIX: Cannot find name 'connectButton'. Did you mean 'connectButtonRef'?
    if (!connected && connectButtonRef.current) {
      // FIX: Cannot find name 'connectButton'. Did you mean 'connectButtonRef'?
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    if (!connected) {
      setMuted(false);
    }
  }, [connected]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      audioRecorder.start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
  }, [connected, client, muted, audioRecorder]);

  const handleMicClick = () => {
    if (connected) {
      setMuted(!muted);
    } else {
      connect();
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDocumentContext(text);
        useLogStore.getState().addTurn({
          role: 'system',
          text: `Tệp đã được tải lên: ${file.name}. Trợ lý bây giờ sẽ trả lời các câu hỏi dựa trên tài liệu này.`,
          isFinal: true,
        });
      };
      reader.onerror = (e) => {
        console.error("Lỗi đọc tệp:", e);
        useLogStore.getState().addTurn({
          role: 'system',
          text: `Không thể đọc tệp: ${file.name}.`,
          isFinal: true,
        });
      };
      reader.readAsText(file);

      // Reset the file input so the user can upload the same file again
      event.target.value = '';
    }
  };
  
  const handleClearContext = () => {
    setDocumentContext(null);
    useLogStore.getState().addTurn({
      role: 'system',
      text: 'Bối cảnh tài liệu đã được xóa.',
      isFinal: true,
    });
  };

  const handleExportLogs = () => {
    const { systemPrompt, model } = useSettings.getState();
    const { turns } = useLogStore.getState();

    const logData = {
      configuration: {
        model,
        systemPrompt,
      },
      conversation: turns.map(turn => ({
        ...turn,
        // Convert Date object to ISO string for JSON serialization
        timestamp: turn.timestamp.toISOString(),
      })),
    };

    const jsonString = JSON.stringify(logData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `live-api-logs-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const micButtonTitle = connected
    ? muted
      ? 'Bật micro'
      : 'Tắt micro'
    : 'Kết nối và bật micro';

  const connectButtonTitle = connected ? 'Dừng truyền phát' : 'Bắt đầu truyền phát';

  return (
    <section className="control-tray">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <nav className={cn('actions-nav')}>
        <button
          className={cn('action-button mic-button')}
          onClick={handleMicClick}
          title={micButtonTitle}
        >
          {!muted ? (
            <span className="material-symbols-outlined filled">mic</span>
          ) : (
            <span className="material-symbols-outlined filled">mic_off</span>
          )}
        </button>
        <button
          className={cn('action-button')}
          onClick={handleFileUploadClick}
          aria-label="Tải tệp lên"
          title="Tải lên tài liệu"
        >
          <span className="icon">upload_file</span>
        </button>
        <button
          className={cn('action-button')}
          onClick={handleClearContext}
          aria-label="Xóa Bối cảnh Tài liệu"
          title="Xóa bối cảnh tài liệu"
          disabled={!documentContext}
        >
          <span className="icon">delete_forever</span>
        </button>
        <button
          className={cn('action-button')}
          onClick={handleExportLogs}
          aria-label="Xuất Nhật ký"
          title="Xuất nhật ký phiên"
        >
          <span className="icon">download</span>
        </button>
        <button
          className={cn('action-button')}
          onClick={useLogStore.getState().clearTurns}
          aria-label="Đặt lại Trò chuyện"
          title="Đặt lại nhật ký phiên"
        >
          <span className="icon">refresh</span>
        </button>
        {children}
      </nav>

      <div className={cn('connection-container', { connected })}>
        <div className="connection-button-container">
          <button
            ref={connectButtonRef}
            className={cn('action-button connect-toggle', { connected })}
            onClick={connected ? disconnect : connect}
            title={connectButtonTitle}
          >
            <span className="material-symbols-outlined filled">
              {connected ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
        <span className="text-indicator">Đang truyền phát</span>
      </div>
    </section>
  );
}

export default memo(ControlTray);