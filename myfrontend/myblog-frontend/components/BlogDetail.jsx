import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../store/toastStore';
import { BlogCardSkeleton } from '../src/components/Skeleton';

/**
 * 🎓 BLOG LIST PAGE - Using Direct Fetch
 * 
 * This component fetches all blog posts from the backend
 * We're using plain fetch() instead of services!
 */

const BlogDetail = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const toast = useToastStore();
  
  const categories = ["All", "Technology", "React", "CSS", "JavaScript", "Node.js", "MongoDB", "Other"];

  // Fetch posts when component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.svg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3001${imageUrl}`;
  };

  /**
   * 🎓 FETCH POSTS - Using Direct Fetch
   * 
   * Step 1: Make GET request to /api/posts
   * Step 2: Check if successful
   * Step 3: Convert response to JSON
   * Step 4: Update state with posts
   */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // 🎓 STEP 1: Make the fetch request
      // GET request is the default, so we don't need to specify method
      const response = await fetch('http://localhost:3001/api/posts');
      
      // 🎓 STEP 2: Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      // 🎓 STEP 3: Convert response to JSON
      const result = await response.json();
      
      // 🎓 STEP 4: Update state with the data array
      setBlogPosts(result.data || []);
      
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Now blogPosts is properly initialized as array
  const filteredPosts = blogPosts.filter((post) => {
    const categoryMatch = selectedCategory === "All" || post.category === selectedCategory;
    const searchMatch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Navigate to single post
  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover articles about web development, design, and technology
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-950 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          /* Loading State */
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          /* Posts List */
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {filteredPosts.map((post, index) => (
              <article
                key={post._id}
                onClick={() => handlePostClick(post._id)}
                className="stagger-item group bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-800 cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Post Image */}
                <div className="h-56 overflow-hidden bg-gray-200 dark:bg-slate-800">
                   <img
    src={getImageUrl(post.image)}
    alt={post.title}
    onError={(e) => {
      e.target.src = '/placeholder.svg';
    }}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
  />
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-200 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.content.substring(0, 150)}...
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>By {post.author?.name || 'Anonymous'}</span>
                      <span className="flex items-center gap-1">👁 {post.views || 0}</span>
                    </div>
                    <span className="font-bold text-blue-600">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* No Posts Found */
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
