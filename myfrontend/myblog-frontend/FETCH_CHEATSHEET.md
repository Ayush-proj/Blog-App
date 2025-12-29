# 🚀 Fetch API Cheat Sheet

## 📋 Quick Reference

### Basic GET Request
```javascript
const response = await fetch('http://localhost:5000/api/posts');
const data = await response.json();
```

### POST Request (Create)
```javascript
const response = await fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ title, content })
});
const data = await response.json();
```

### PUT Request (Update)
```javascript
const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ title, content })
});
```

### DELETE Request
```javascript
const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### File Upload
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 🔑 Common Patterns

### With Error Handling
```javascript
try {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Request failed');
  }
  
  const data = await response.json();
  // Use data
  
} catch (error) {
  console.error('Error:', error);
}
```

### With Loading State
```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch(url);
    const data = await response.json();
    // Use data
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Get Token from localStorage
```javascript
const token = localStorage.getItem('token');
```

### Save Token to localStorage
```javascript
localStorage.setItem('token', data.token);
```

---

## 📍 Your Backend Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

### Comments
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments/:postId` - Add comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Upload
- `POST /api/upload` - Upload image (auth required)

### Contact
- `POST /api/contact` - Send contact message

---

## ⚡ Copy-Paste Templates

### Template 1: Fetch List
```javascript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('http://localhost:5000/api/posts')
    .then(res => res.json())
    .then(data => setItems(data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);
```

### Template 2: Form Submit
```javascript
const [formData, setFormData] = useState({ /* fields */ });
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Failed');
    
    alert('Success!');
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Template 3: Delete with Confirmation
```javascript
const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed');
    
    alert('Deleted!');
    // Refresh list
  } catch (err) {
    alert(err.message);
  }
};
```

---

## 🎯 Common Mistakes to Avoid

### ❌ Forgetting await
```javascript
const data = fetch(url);  // Wrong! Returns Promise
```

### ✅ Correct
```javascript
const response = await fetch(url);
const data = await response.json();
```

---

### ❌ Not checking response.ok
```javascript
const response = await fetch(url);
const data = await response.json();  // Might fail!
```

### ✅ Correct
```javascript
const response = await fetch(url);
if (!response.ok) throw new Error('Failed');
const data = await response.json();
```

---

### ❌ Setting Content-Type for FormData
```javascript
const formData = new FormData();
fetch(url, {
  headers: {
    'Content-Type': 'multipart/form-data'  // Wrong!
  },
  body: formData
});
```

### ✅ Correct
```javascript
const formData = new FormData();
fetch(url, {
  // No Content-Type header - browser sets it automatically
  body: formData
});
```

---

## 🔥 Pro Tips

1. **Always use try-catch** with async/await
2. **Check response.ok** before parsing JSON
3. **Use loading states** for better UX
4. **Store token** in localStorage after login
5. **Add token** to headers for protected routes
6. **Don't set Content-Type** for FormData uploads
7. **Use finally** to stop loading regardless of success/failure

---

## 📚 Next Steps

1. ✅ Read `FETCH_API_TUTORIAL.md` for detailed examples
2. ✅ Check `examples/FetchExamples.jsx` for working code
3. ✅ Try examples in your components
4. ✅ Practice with your backend API
5. ✅ Later, learn about services pattern in `FETCH_VS_SERVICES.md`

---

## 🎉 You Got This!

Fetch is simple once you understand the pattern:
1. Make request with `fetch()`
2. Check if `response.ok`
3. Parse with `response.json()`
4. Use the data!

Happy coding! 🚀
