/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './WelcomeScreen.css';

const welcomeContent = {
  title: 'Hỏi đáp cùng AI',
  description: 'Nội dung do AI tạo ra để tham khảo, phục vụ nghiên cứu và giảng dạy về AI',
  prompts: [
    "Thủ đô của Pháp là gì?",
    "Ai đã thắng World Cup 2022?",
    "Công thức làm bánh chocolate chip?",
  ],
};

const WelcomeScreen: React.FC = () => {
  const { title, description, prompts } = welcomeContent;
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="title-container">
          <span className="welcome-icon">mic</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
        <div className="example-prompts">
          {prompts.map((prompt, index) => (
            <div key={index} className="prompt">{prompt}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;