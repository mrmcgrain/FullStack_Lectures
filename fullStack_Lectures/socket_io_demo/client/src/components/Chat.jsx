import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import RoomSelector from './RoomSelector';
import '../styles/Chat.css';

const Chat = () => {
  const { socket, connected } = useSocket();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [userTyping, setUserTyping] = useState('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for previously stored messages when joining a room
    socket.on('previous_messages', (previousMessages) => {
      setMessages(previousMessages);
    });

    // Handle typing indicators
    socket.on('user_typing', (user) => {
      setUserTyping(user);
    });

    socket.on('user_stop_typing', () => {
      setUserTyping('');
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('receive_message');
      socket.off('previous_messages');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket]);

  const joinRoom = () => {
    if (room && username && socket) {
      socket.emit('join_room', room);
      setJoined(true);
    }
  };

  const sendMessage = (messageText) => {
    if (messageText.trim() && socket && room) {
      const messageData = {
        room,
        user: username,
        text: messageText,
        timestamp: new Date()
      };
      socket.emit('send_message', messageData);
      
      // Clear typing indicator on send
      socket.emit('stop_typing', { room });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTyping = () => {
    if (socket && room) {
      socket.emit('typing', { user: username, room });
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a new timeout
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { room });
      }, 2000);
    }
  };

  if (!connected) {
    return <div className="connecting-message">Connecting to server...</div>;
  }

  if (!joined) {
    return (
      <div className="join-container">
        <h2>Join a Chat Room</h2>
        <div className="join-inputs">
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom} disabled={!username || !room}>
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room: {room}</h2>
        <div className="user-info">Logged in as: <span>{username}</span></div>
      </div>
      
      <MessageList messages={messages} currentUser={username} />
      
      {userTyping && (
        <div className="typing-indicator">{userTyping} is typing...</div>
      )}
      
      <MessageInput onSendMessage={sendMessage} onTyping={handleTyping} />
    </div>
  );
};

export default Chat;