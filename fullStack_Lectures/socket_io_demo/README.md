# Real-time Chat Application with Socket.io (MERN Stack)

This is a demonstration of how to build a real-time chat application using the MERN stack with Socket.io for WebSocket communication. This project is designed as a teaching tool to show students how Socket.io can be used to create real-time features in web applications.

## Features

- Real-time messaging with Socket.io
- Multiple chat rooms
- Message history stored in MongoDB
- User typing indicators
- Responsive design
- Message timestamps

## Technology Stack

- **MongoDB**: Database for storing chat messages
- **Express**: Backend framework
- **React**: Frontend library
- **Node.js**: Runtime environment
- **Socket.io**: Real-time bidirectional event-based communication

## Project Structure

```
project/
├── client/             # React frontend
│   ├── public/         # Static files
│   └── src/            # Source files
│       ├── assets/     # Images, icons, etc.
│       ├── components/ # React components
│       ├── context/    # React context providers
│       └── styles/     # CSS files
├── server/             # Node.js backend
    ├── server.js       # Express + Socket.io server
    └── package.json    # Server dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd real-time-chat-app
   ```

2. Set up the server:
   ```
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chatApp
   ```

4. Set up the client:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start MongoDB (if using a local instance)

2. Start the server:
   ```
   cd server
   npm run dev
   ```

3. Start the client:
   ```
   cd client
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How Socket.io Works

Socket.io enables real-time, bidirectional communication between web clients and servers. It primarily uses WebSockets, but can fall back to other methods like long-polling when WebSockets aren't available.

### Key Socket.io Concepts Demonstrated:

1. **Connection Setup**:
   - Server-side socket initialization with CORS configuration
   - Client-side connection to the socket server

2. **Rooms**:
   - Joining specific chat rooms with `socket.join()`
   - Sending messages to specific rooms with `io.to(room).emit()`

3. **Events**:
   - Custom events like `join_room`, `send_message`, `typing`
   - Listening for events with `socket.on()`
   - Broadcasting events with `socket.emit()`, `socket.to().emit()`, and `io.emit()`

4. **Acknowledgments & Error Handling**:
   - Proper error handling for database operations
   - Connection status tracking

## Learning Objectives

Students should understand:

- How WebSockets differ from HTTP requests
- Setting up Socket.io with an Express server
- Implementing Socket.io on the client-side with React
- Managing socket connections, rooms, and events
- Building a real-time UI that responds to socket events
- Integrating WebSockets with a database for persistence

## Further Enhancements

- User authentication
- Private messaging
- File sharing
- Read receipts
- Message reactions
- Push notifications

## License

[MIT License](LICENSE)