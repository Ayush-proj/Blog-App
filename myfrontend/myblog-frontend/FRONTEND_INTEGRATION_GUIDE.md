# 🚀 Frontend Integration Guide

## ✅ What We've Built (Step 1 Complete)

### 📁 Project Structure
```
myfrontend/myblog-frontend/
├── src/
│   ├── services/           ✅ NEW - API Service Layer
│   │   ├── api.js         → Axios instance with interceptors
│   │   ├── authService.js → Login, register, logout
│   │   ├── postService.js → All post operations
│   │   ├── commentService.js → Comment operations
│   │   ├── uploadService.js → Image upload
│   │   └── index.js       → Central export
│   │
│   ├── components/
│   │   ├── ui/            ✅ NEW - Reusable UI Components
│   │   │   ├── Input.jsx  → Form input with validation
│   │   │   └── Button.jsx → Button with loading state
│   │   └── Toast.jsx      ✅ NEW - Toast notifications
│   │
├── store/
│   ├── authStore.js       ✅ NEW - Authentication state
│   ├── toastStore.js      ✅ NEW - Toast notifications state
│   └── appStore.js        ✅ EXISTING - App state
│
└── .env                   ✅ NEW - Environment variables
```

---

## 🎯 What Each Service Does

### 1. **api.js** - The Foundation
```javascript
// Centralized Axios instance
- Base URL configuration
- Automatic token attachment to requests
- Global error handling
- Request/Response logging
- 401 handling (auto-logout on unauthorized)
```

### 2. **authService.js** - Authentication
```javascript
Available methods:
✅ register(userData)      → Register new user
✅ login(credentials)      → Login user
✅ logout()                → Logout user
✅ getCurrentUser()        → Get user from localStorage
✅ isAuthenticated()       → Check if logged in
✅ getToken()              → Get JWT token
```

### 3. **postService.js** - Blog Posts
```javascript
Available methods:
✅ getAllPosts(filters)    → Get all posts with filters
✅ getPostById(id)         → Get single post
✅ getPostsByCategory(cat) → Filter by category
✅ createPost(data)        → Create new post
✅ updatePost(id, data)    → Update post
✅ deletePost(id)          → Delete post
✅ likePost(id)            → Like a post
✅ unlikePost(id)          → Unlike a post
```

### 4. **commentService.js** - Comments
```javascript
Available methods:
✅ getCommentsByPost(postId) → Get all comments
✅ createComment(postId, content) → Add comment
✅ deleteComment(commentId) → Delete comment
```

### 5. **uploadService.js** - File Upload
```javascript
Available methods:
✅ uploadImage(file, onProgress) → Upload image
✅ validateImage(file) → Validate before upload
```

---

## 🔐 Authentication Flow

### How It Works:
```
1. User logs in → authService.login()
2. Backend returns { user, token }
3. Token saved to localStorage
4. Token automatically attached to all future requests
5. On 401 error → Auto logout and redirect to login
```

### Using Auth in Components:
```javascript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  // Check if user is logged in
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  // Access user data
  return <div>Welcome, {user.name}!</div>;
}
```

---

## 🔔 Toast Notifications

### Using Toasts:
```javascript
import { useToastStore } from '@/store/toastStore';

function MyComponent() {
  const toast = useToastStore();
  
  const handleSuccess = () => {
    toast.success('Post created successfully!');
  };
  
  const handleError = () => {
    toast.error('Something went wrong!');
  };
  
  const handleInfo = () => {
    toast.info('Loading your data...');
  };
  
  const handleWarning = () => {
    toast.warning('Are you sure?');
  };
}
```

---

## 📝 Form Components

### Input Component:
```javascript
import Input from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email?.message}
  required
  {...register('email')}
/>
```

### Button Component:
```javascript
import Button from '@/components/ui/Button';

<Button 
  variant="primary"  // primary, secondary, danger, ghost
  size="md"          // sm, md, lg
  loading={isLoading}
  disabled={!isValid}
>
  Submit
</Button>
```

---

## 🎨 Example: Login Page

```javascript
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const toast = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      toast.success('Login successful!');
      // Redirect to dashboard
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Button type="submit" loading={loading} className="w-full">
        Login
      </Button>
    </form>
  );
}
```

---

## 🎨 Example: Fetching Posts

```javascript
import { useState, useEffect } from 'react';
import { postService } from '@/services';
import { useToastStore } from '@/store/toastStore';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Example: Creating a Post

```javascript
import { useState } from 'react';
import { postService } from '@/services';
import { useToastStore } from '@/store/toastStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postService.createPost(formData);
      toast.success('Post created successfully!');
      // Reset form or redirect
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <Button type="submit" loading={loading}>
        Create Post
      </Button>
    </form>
  );
}
```

---

## 🔧 Environment Variables

Update `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-production-api.com/api
```

---

## ✅ Next Steps

### Phase 2: Build Authentication Pages
- [ ] Login page with validation
- [ ] Register page with validation
- [ ] Protected route wrapper
- [ ] Redirect logic

### Phase 3: Build Blog Pages
- [ ] Blog list page with filters
- [ ] Single blog post page
- [ ] Create/Edit post page
- [ ] Comment section

### Phase 4: Add React Router
- [ ] Set up routing
- [ ] Protected routes
- [ ] Navigation

### Phase 5: Polish
- [ ] Loading states everywhere
- [ ] Error boundaries
- [ ] Responsive design
- [ ] Form validation with react-hook-form

---

## 🎓 Key Concepts Learned

1. **Service Layer Pattern**: All API calls in one place
2. **State Management**: Zustand for global state
3. **Error Handling**: Centralized in axios interceptors
4. **Token Management**: Automatic attachment to requests
5. **User Feedback**: Toast notifications for all actions
6. **Reusable Components**: DRY principle in action

---

## 🚀 Ready to Continue?

You now have a solid foundation! Next, we'll build:
1. Login/Register pages
2. Protected routes
3. Blog list with real API data
4. Create post functionality

Let me know when you're ready to continue! 🎉
