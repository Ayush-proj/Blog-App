# 🎓 Fetch API Tutorial - The Normal Way

## 📚 What is Fetch?

`fetch()` is the **built-in JavaScript way** to make HTTP requests to your backend API. No libraries needed!

---

## 🔥 Basic Fetch Syntax

```javascript
fetch('url')
  .then(response => response.json())  // Convert to JSON
  .then(data => console.log(data))    // Use the data
  .catch(error => console.error(error)); // Handle errors
```

Or with **async/await** (cleaner):

```javascript
async function getData() {
  try {
    const response = await fetch('url');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

---

## 🎯 Complete Examples for Your Blog App

### 1. **GET Request - Fetch All Posts**

```javascript
// In your component
import { useState, useEffect } from 'react';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Make the request
      const response = await fetch('http://localhost:5000/api/posts');
      
      // Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      // Convert response to JSON
      const data = await response.json();
      
      // Update state
      setPosts(data);
      setError(null);
      
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 2. **GET Request - Fetch Single Post by ID**

```javascript
function SinglePost({ postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
      
      if (!response.ok) {
        throw new Error('Post not found');
      }
      
      const data = await response.json();
      setPost(data);
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>By: {post.author?.name}</p>
    </div>
  );
}
```

---

### 3. **POST Request - User Login**

```javascript
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      // Check if login was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Get the response data
      const data = await response.json();
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect or update UI
      alert('Login successful!');
      window.location.href = '/dashboard';
      
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

### 4. **POST Request - User Registration**

```javascript
function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('Registration successful!');
      window.location.href = '/dashboard';
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Name"
        required
      />
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        required
      />
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

### 5. **POST Request with Authentication - Create Post**

```javascript
function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        return;
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // ⭐ Send token
        },
        body: JSON.stringify({
          title,
          content,
          category
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      
      alert('Post created successfully!');
      // Clear form
      setTitle('');
      setContent('');
      setCategory('');
      
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreatePost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        required
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
        required
      />
      
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

### 6. **PUT Request - Update Post**

```javascript
function EditPost({ postId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // First, fetch the existing post
  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
      const data = await response.json();
      
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      alert('Post updated successfully!');
      
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Post'}
      </button>
    </form>
  );
}
```

---

### 7. **DELETE Request - Delete Post**

```javascript
function DeletePostButton({ postId }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      alert('Post deleted successfully!');
      // Redirect or refresh
      window.location.href = '/blog';
      
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      style={{backgroundColor: 'red', color: 'white'}}
    >
      {loading ? 'Deleting...' : 'Delete Post'}
    </button>
  );
}
```

---

### 8. **POST Request - Add Comment**

```javascript
function CommentForm({ postId }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      
      alert('Comment added!');
      setContent(''); // Clear form
      
      // Refresh comments or update state
      
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddComment}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
```

---

### 9. **GET Request - Fetch Comments**

```javascript
function CommentsList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div>
      <h3>Comments ({comments.length})</h3>
      {comments.map(comment => (
        <div key={comment._id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
          <p>{comment.content}</p>
          <small>By: {comment.user?.name}</small>
        </div>
      ))}
    </div>
  );
}
```

---

### 10. **POST Request - Upload Image**

```javascript
function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // ⚠️ Don't set Content-Type for FormData - browser sets it automatically
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setImageUrl(data.imageUrl);
      alert('Image uploaded successfully!');
      
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
      
      {imageUrl && (
        <div>
          <p>Uploaded image:</p>
          <img src={imageUrl} alt="Uploaded" style={{maxWidth: '300px'}} />
        </div>
      )}
    </div>
  );
}
```

---

## 🔑 Key Concepts

### 1. **HTTP Methods**
- `GET` - Fetch data (default)
- `POST` - Create new data
- `PUT` - Update existing data
- `DELETE` - Delete data

### 2. **Headers**
```javascript
headers: {
  'Content-Type': 'application/json',  // For JSON data
  'Authorization': `Bearer ${token}`    // For authentication
}
```

### 3. **Request Body**
```javascript
body: JSON.stringify({
  key: 'value'
})
```

### 4. **Error Handling**
```javascript
if (!response.ok) {
  throw new Error('Request failed');
}
```

### 5. **Authentication**
```javascript
// Save token after login
localStorage.setItem('token', data.token);

// Use token in requests
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🎯 Complete Example Component

Here's a full component that combines everything:

```javascript
import { useState, useEffect } from 'react';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/posts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
      setError(null);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      // Remove from UI
      setPosts(posts.filter(post => post._id !== postId));
      alert('Post deleted!');
      
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id} style={{border: '1px solid #ccc', padding: '20px', margin: '10px'}}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default BlogPage;
```

---

## 🚀 Next Steps

1. Try these examples in your components
2. Understand how fetch works
3. Learn about async/await
4. Practice error handling
5. Then later, you can learn about the services pattern!

The services pattern is just a way to organize these fetch calls - but the core concept is the same! 🎉
