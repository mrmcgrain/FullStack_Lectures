import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        
        // Remove the deleted post from state
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        console.error('Error deleting post:', err);
        alert(err.message || 'Error deleting post');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="post-list-container empty">
        <h2>No posts yet</h2>
        <p>
          <Link to="/create" className="create-link">Create your first post</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <h2>All Posts</h2>
      
      <div className="post-grid">
        {posts.map(post => (
          <div className="post-card" key={post._id}>
            <div className="post-image">
              <Link to={`/post/${post._id}`}>
                <img 
                  src={`http://localhost:5000${post.imagePath}`} 
                  alt={post.title} 
                />
              </Link>
            </div>
            
            <div className="post-content">
              <h3>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h3>
              <p className="post-description">
                {post.description.length > 100 
                  ? `${post.description.substring(0, 100)}...` 
                  : post.description}
              </p>
              
              <div className="post-actions">
                <Link to={`/post/${post._id}`} className="view-btn">
                  View Details
                </Link>
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;