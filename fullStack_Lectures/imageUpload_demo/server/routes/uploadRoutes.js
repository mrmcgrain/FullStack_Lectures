const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Handle image upload
router.post('/', async (req, res) => {
  try {
    // Check if any files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    // Access the uploaded file
    const imageFile = req.files.image;
    const fileExtension = path.extname(imageFile.name);
    
    // Generate unique filename with UUID to avoid collisions
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const uploadPath = path.join(__dirname, '../uploads/', uniqueFilename);

    // Save the file to the uploads directory
    await imageFile.mv(uploadPath);

    // Return success response with the file path
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