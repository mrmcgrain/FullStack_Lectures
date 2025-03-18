import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        
        // Navigate back to home page after deletion
        navigate('/');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert(err.message || 'Error deleting post');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <h2>{post.title}</h2>
        <div className="post-detail-meta">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className="post-detail-image">
        <img 
          src={`http://localhost:5000${post.imagePath}`} 
          alt={post.title} 
        />
      </div>
      
      <div className="post-detail-content">
        <p>{post.description}</p>
      </div>
      
      <div className="post-detail-actions">
        <Link to="/" className="back-btn">Back to Posts</Link>
        <button onClick={handleDelete} className="delete-btn">Delete Post</button>
      </div>
    </div>
  );
};

export default PostDetail;