import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Image Upload Demo</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">All Posts</Link>
              </li>
              <li>
                <Link to="/create">Create Post</Link>
              </li>
            </ul>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
        
        <footer>
          <p>&copy; 2023 Image Upload Demo</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
