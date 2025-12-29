import { useState } from 'react';
import { postService, authService } from '../services';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * 🧪 TEST API PAGE
 * 
 * This page demonstrates how to use all the services we created
 * Use this as a reference for building your actual pages
 */

const TestApiPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const toast = useToastStore();
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Test: Fetch all posts
  const handleFetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts();
      setPosts(response.data);
      toast.success(`Loaded ${response.count} posts!`);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  // Test: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Test: Logout
  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
  };

  // Test: Different toast types
  const showToasts = () => {
    toast.success('This is a success message!');
    setTimeout(() => toast.error('This is an error message!'), 1000);
    setTimeout(() => toast.info('This is an info message!'), 2000);
    setTimeout(() => toast.warning('This is a warning message!'), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        🧪 API Testing Page
      </h1>

      {/* Authentication Status */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        {isAuthenticated ? (
          <div>
            <p className="text-green-600 dark:text-green-400">
              ✅ Logged in as: {user?.name} ({user?.email})
            </p>
            <Button onClick={handleLogout} variant="danger" size="sm" className="mt-2">
              Logout
            </Button>
          </div>
        ) : (
          <p className="text-red-600 dark:text-red-400">❌ Not logged in</p>
        )}
      </div>

      {/* Login Form */}
      {!isAuthenticated && (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>
        </div>
      )}

      {/* Test Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test API Calls</h2>
        
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleFetchPosts} loading={loading}>
            Fetch All Posts
          </Button>
          
          <Button onClick={showToasts} variant="secondary">
            Show All Toast Types
          </Button>
        </div>
      </div>

      {/* Display Posts */}
      {posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow"
              >
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  By {post.author?.name} • {post.category}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {post.content?.substring(0, 150)}...
                </p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>👁️ {post.views} views</span>
                  <span>❤️ {post.likesCount} likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">📚 How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Make sure your backend is running on http://localhost:3001</li>
          <li>Click "Fetch All Posts" to test the API connection</li>
          <li>Try logging in with a test account</li>
          <li>Click "Show All Toast Types" to see notifications</li>
          <li>Check the browser console for API logs</li>
        </ol>
      </div>
    </div>
  );
};

export default TestApiPage;
