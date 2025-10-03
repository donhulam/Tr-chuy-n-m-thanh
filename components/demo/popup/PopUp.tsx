/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './PopUp.css';

interface PopUpProps {
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Chào mừng đến với Trò chuyện lời nói cùng AI</h2>
        <p>Bắt đầu cuộc trò chuyện bằng giọng nói của bạn với Gemini.</p>
        <p>Để bắt đầu:</p>
        <ol>
          <li><span className="icon">play_circle</span>Nhấn nút Phát để bắt đầu truyền phát âm thanh.</li>
          <li><span className="icon">save_as</span>Sao chép sandbox này để tạo phiên bản của riêng bạn.</li>
          <li><span className="icon">auto_awesome</span>Sử dụng Trợ lý Mã để tùy chỉnh và kiểm tra sản phẩm của bạn.</li>
        </ol>
        <button onClick={onClose}>Bắt đầu Xây dựng</button>
      </div>
    </div>
  );
};

export default PopUp;