import { useState } from 'react';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping();
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        autoFocus
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={!message.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;