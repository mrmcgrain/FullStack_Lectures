import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create Message Schema
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  room: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join a room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    
    // Fetch previous messages for this room
    Message.find({ room }).sort({ timestamp: 1 })
      .then(messages => {
        socket.emit('previous_messages', messages);
      })
      .catch(err => console.error('Error fetching messages:', err));
  });
  
  // Listen for messages
  socket.on('send_message', async (messageData) => {
    const { user, text, room } = messageData;
    console.log(`Message received in room ${room}: ${text} from ${user}`);
    
    // Save message to database
    const newMessage = new Message({
      user,
      text,
      room
    });
    
    try {
      await newMessage.save();
      // Send message to all users in the room
      io.to(room).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  
  // User typing indicator
  socket.on('typing', ({ user, room }) => {
    socket.to(room).emit('user_typing', user);
  });
  
  // User stops typing
  socket.on('stop_typing', ({ room }) => {
    socket.to(room).emit('user_stop_typing');
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API routes
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Message.distinct('room');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});