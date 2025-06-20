import React, { useState, useEffect } from 'react';
import socket from './socket';
import './ChatBox.css';

const ChatBox = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (msg) => setMessages(prev => [...prev, msg]);
    socket.on('chat_message', handler);
    return () => socket.off('chat_message', handler);
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat_message', { name: username, message: input });
      setInput('');
    }
  };

  return (
    <div className="chat-wrapper">
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        {open ? '✖' : '💬'}
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">Live Chat</div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className="chat-msg">
                <strong>{m.name || 'Unknown'}:</strong> {m.message}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;