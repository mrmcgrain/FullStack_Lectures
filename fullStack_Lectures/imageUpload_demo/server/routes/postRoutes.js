const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all posts
router.get('/', async (req, res) => {
    console.log('Fetching all posts');
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    console.log(`Fetching post with ID: ${req.params.id}`);
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post with an image
router.post('/', async (req, res) => {
    console.log('Creating a new post', req.body);
  // Check if all required fields are present   
  try {
    const { title, description, imagePath, imageFilename } = req.body;
    
    if (!title || !description || !imagePath || !imageFilename) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newPost = new Post({
      title,
      description,
      imagePath,
      imageFilename
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post and its associated image file
router.delete('/:id', async (req, res) => {
    console.log(`Deleting post with ID: ${req.params.id}`);     
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Delete the image file from the server
    const imagePath = path.join(__dirname, '..', post.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete the post document from the database
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;