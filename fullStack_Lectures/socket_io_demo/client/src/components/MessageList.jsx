import { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">No messages yet. Start the conversation!</div>
      ) : (
        messages.map((message, index) => {
          const isCurrentUser = message.user === currentUser;
          return (
            <div 
              key={index} 
              className={`message ${isCurrentUser ? 'message-own' : 'message-other'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="message-user">{isCurrentUser ? 'You' : message.user}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;