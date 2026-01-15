// client/src/components/Game/ChatBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { socketService } from '../../services/SocketService';
import './ChatBox.scss';

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const { messages } = useGameStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socketService.sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-box__messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-box__message">
            <span className="chat-box__sender">{msg.senderName}:</span>
            <span className="chat-box__text">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-box__input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="chat-box__input"
        />
        <button type="submit" className="chat-box__send-btn">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
