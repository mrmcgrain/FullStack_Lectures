import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostForm.css';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle file selection and generate preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !selectedFile) {
      setError('Please fill out all fields and select an image');
      return;
    }
    
    try {
      setIsUploading(true);
      setError('');

      // Step 1: Upload the image file
      const formData = new FormData();
      formData.append('image', selectedFile);

      const uploadResponse = await fetch('http://localhost:5000/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      const { imagePath, filename } = uploadData;

      // Step 2: Create the post with the image path
      const postResponse = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imagePath,
          imageFilename: filename,
        }),
      });

      if (!postResponse.ok) {
        throw new Error('Failed to create post');
      }

      // Redirect to the home page on success
      navigate('/');
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Error creating post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="post-form-container">
      <h2>Create New Post</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        
        {previewUrl && (
          <div className="image-preview">
            <h3>Preview:</h3>
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;