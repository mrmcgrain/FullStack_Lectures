
# Creating a MERN App for Image File Upload Demonstration

I'll create a fullstack MERN application that demonstrates how to upload image files from a blog or social media site to the server using express-fileupload, store the image paths in MongoDB via Mongoose, and retrieve them later.

Here's my step-by-step solution:

1. Fix the typo in the .gitignore file
2. Create a server structure with Express, express-fileupload, and Mongoose
3. Create a client React app with file upload functionality
4. Set up the MongoDB model for storing image metadata
5. Implement the API routes for file uploads and retrieval

Let's start implementing:

### [.gitignore](file:///g%3A/fullStack_Lectures/socket_io_demo/server/.gitignore)

Fix the typo in the .gitignore file:

````ignore
.qodo
node_modules
.env
/uploads/*
!uploads/.gitkeep
```

### g:\fullStack_Lectures\socket_io_demo\server\package.json

Create a package.json file for the server:

````json
// filepath: g:\fullStack_Lectures\socket_io_demo\server\package.json
{
  "name": "image-upload-demo",
  "version": "1.0.0",
  "description": "MERN image upload demonstration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-fileupload": "^1.4.0",
    "mongoose": "^6.9.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### g:\fullStack_Lectures\socket_io_demo\server\server.js

Create the main server file:

````javascript
// filepath: g:\fullStack_Lectures\socket_io_demo\server\server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  abortOnLimit: true
}));

// Make uploads folder accessible as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/image-upload-demo')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/uploads', require('./routes/uploadRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### g:\fullStack_Lectures\socket_io_demo\server\models\Post.js

Create a Post model for storing image metadata:

````javascript
// filepath: g:\fullStack_Lectures\socket_io_demo\server\models\Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  imageFilename: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
```

### g:\fullStack_Lectures\socket_io_demo\server\routes\uploadRoutes.js

Create routes for handling file uploads:

````javascript
// filepath: g:\fullStack_Lectures\socket_io_demo\server\routes\uploadRoutes.js
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    const imageFile = req.files.image;
    const fileExtension = path.extname(imageFile.name);
    
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const uploadPath = path.join(__dirname, '../uploads/', uniqueFilename);

    // Save the file
    await imageFile.mv(uploadPath);

    return res.status(200).json({
      message: 'File uploaded successfully',
      imagePath: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

module.exports = router;
```

### g:\fullStack_Lectures\socket_io_demo\server\routes\postRoutes.js

Create routes for post CRUD operations:

````javascript
// filepath: g:\fullStack_Lectures\socket_io_demo\server\routes\postRoutes.js
const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a post with an image
router.post('/', async (req, res) => {
  try {
    const { title, content, imagePath, imageFilename } = req.body;
    
    if (!title || !content || !imagePath || !imageFilename) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newPost = new Post({
      title,
      content,
      imagePath,
      imageFilename
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post and its image
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Delete the image file
    const imagePath = path.join(__dirname, '..', post.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### g:\fullStack_Lectures\socket_io_demo\client\package.json

Create package.json for the client:

````json
// filepath: g:\fullStack_Lectures\socket_io_demo\client\package.json
{
  "name": "image-upload-client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.3.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:5000",
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### g:\fullStack_Lectures\socket_io_demo\client\src\App.js

Create the main App component:

````javascript
// filepath: g:\fullStack_Lectures\socket_io_demo\client\src\App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Image Upload Demo</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
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
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

### g:\fullStack_Lectures\socket_io_demo\client\src\components\CreatePost.js

Create a component for uploading images and creating posts:

````javascript
// filepath: g:\fullStack_Lectures\socket_io_demo\client\src\components\CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create a preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !file) {
      setError('All fields are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // First, upload the image
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadResponse = await axios.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const { imagePath, filename } = uploadResponse.data;
      
      // Then, create the post with the image path
      const postResponse = await axios.post('/api/posts', {
        title,
        content,
        imagePath,
        imageFilename: filename
      });
      
      // Redirect to the post detail page
      navigate(`/post/${postResponse.data._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:

