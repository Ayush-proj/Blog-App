// myfrontend/myblog-frontend/components/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// 🎓 LEARNING: API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const DashboardPage = () => {
  // 🎓 Get user and token from auth store
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // 🎓 STATE: Store our data from the API
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 🎓 FETCH USER'S POSTS
   * 
   * This function runs when the component loads
   * It fetches all posts from the API and filters for the current user's posts
   */
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log('🔍 Starting to fetch posts...');
        console.log('User:', user);
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('API URL:', `${API_URL}/posts`);
        
        setLoading(true);
        setError(null);

        // 🎓 STEP 1: Make GET request to fetch all posts
        const response = await fetch(`${API_URL}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            // Note: GET /posts doesn't require authentication
          }
        });

        console.log('📡 Response received!');
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        // 🎓 STEP 2: Check if request was successful
        if (!response.ok) {
          const errorText = await response.text();
          console.log('❌ Error response:', errorText);
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        // 🎓 STEP 3: Get the data from response
        console.log('📦 Parsing JSON...');
        const data = await response.json();
        console.log('📦 Received data:', data);
        console.log('📦 Number of posts:', data.data?.length);
        
        // 🎓 STEP 4: Filter posts to show only current user's posts
        // data.data is an array of all posts
        // We filter where post.author._id matches current user's id
        const myPosts = data.data.filter(post => {
          const authorId = post.author?._id || post.author;
          const userId = user?.id || user?._id;
          console.log('Comparing:', authorId, 'with', userId);
          return authorId === userId;
        });

        console.log('✅ My posts:', myPosts.length);

        // 🎓 STEP 5: Calculate statistics
        const totalViews = myPosts.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalLikes = myPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);

        // 🎓 STEP 6: Update state with fetched data
        setUserPosts(myPosts);
        setStats({
          totalPosts: myPosts.length,
          totalViews: totalViews,
          totalLikes: totalLikes
        });

        console.log('✅ Dashboard loaded successfully!');

      } catch (err) {
        console.error('❌ Error fetching posts:', err);
        if (err.name === 'AbortError') {
          setError('Request timeout - Please check if backend is running on port 3001');
        } else {
          setError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is logged in
    if (user && token) {
      fetchUserPosts();
    } else {
      console.log('⚠️ No user or token, skipping fetch');
      setLoading(false);
    }
  }, [user, token]); // Re-run if user or token changes

  /**
   * 🎓 HANDLE POST CLICK
   * Navigate to the post detail page
   */
  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  /**
   * 🎓 HANDLE EDIT POST
   * Navigate to edit page
   */
  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  /**
   * 🎓 HANDLE DELETE POST
   * Delete a post from the database
   */
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting post:', postId);
      console.log('🔑 Using token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Delete error:', errorData);
        throw new Error(errorData.message || 'Failed to delete post');
      }

      // Remove post from state (update UI immediately)
      const deletedPost = userPosts.find(post => post._id === postId);
      setUserPosts(userPosts.filter(post => post._id !== postId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts - 1,
        totalViews: prev.totalViews - (deletedPost?.views || 0),
        totalLikes: prev.totalLikes - (deletedPost?.likesCount || 0)
      }));

      alert('Post deleted successfully!');
      console.log('✅ Post deleted successfully');
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert(err.message || 'Failed to delete post');
    }
  };

  /**
   * 🎓 FORMAT DATE
   * Convert ISO date to readable format
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 🎓 LOADING STATE: Show while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🎓 ERROR STATE: Show if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Welcome back, {user?.name}! Here's your blog overview.
          </p>
        </div>

        {/* 🎓 STATS GRID: Display real statistics from API */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Posts
                </p>
                <p className="text-4xl font-bold text-slate-950 dark:text-white mt-2">
                  {stats.totalPosts}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Views
                </p>
                <p className="text-4xl font-bold text-slate-950 dark:text-white mt-2">
                  {stats.totalViews}
                </p>
              </div>
              <div className="text-4xl">👁</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Likes
                </p>
                <p className="text-4xl font-bold text-slate-950 dark:text-white mt-2">
                  {stats.totalLikes}
                </p>
              </div>
              <div className="text-4xl">❤️</div>
            </div>
          </div>
        </div>

        {/* Create New Post Button */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/create-post')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            ✍️ Create New Post
          </button>
        </div>

        {/* 🎓 POSTS LIST: Display real posts from API */}
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-6">
            Your Posts ({userPosts.length})
          </h2>

          {userPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-gray-200 dark:border-slate-800 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start creating your first blog post!
              </p>
              <button
                onClick={() => navigate('/create-post')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => handlePostClick(post._id)}>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                          {post.category}
                        </span>
                        <span>📅 {formatDate(post.createdAt)}</span>
                        <span>👁 {post.views || 0} views</span>
                        <span>❤️ {post.likesCount || 0} likes</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditPost(post._id)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
