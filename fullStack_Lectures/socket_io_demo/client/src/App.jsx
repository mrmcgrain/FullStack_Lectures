import React from 'react';
import { SocketProvider } from './context/SocketContext';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Real-time Chat with Socket.io</h1>
        <p>A MERN stack demonstration of real-time communication</p>
      </header>
      
      <main>
        <SocketProvider>
          <Chat />
        </SocketProvider>
      </main>
      
      <footer>
        <p>MERN Socket.io Chat Demo</p>
      </footer>
    </div>
  );
}

export default App;
