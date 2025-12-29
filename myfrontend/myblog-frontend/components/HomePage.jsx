import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../src/services';
import { useToastStore } from '../store/toastStore';
import YouTubeEmbed from "./YouTubeEmbed";
import { ParallaxHero } from "./ParallaxHero";
import { BlogCardSkeleton } from '../src/components/Skeleton';
import heroimg from "../src/public/hero.jpg";

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToastStore();

  // Fetch posts from backend when component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts({ published: true });
      setBlogPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to single blog post
  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-left">
            <div className="inline-block">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                Welcome to BlogHub
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-950 dark:text-white leading-tight">
              Explore Ideas, Share Knowledge
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              A platform for developers and tech enthusiasts to share insights, tutorials, and experiences in web
              development and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/blog')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Read Blog
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-3 border-2 border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-900 transition-all"
              >
                Get in Touch
              </button>
            </div>
          </div>

          <div className="relative h-96 md:h-full min-h-96 animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl blur-3xl animate-pulse-slow" />
            <img
              src={heroimg}
              alt="Hero illustration"
              className="relative w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Parallax Hero Section */}
      <ParallaxHero />

      {/* Latest Posts Section */}
      <section id="latest-posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-950 dark:text-white mb-4">Latest Posts</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Discover our most recent articles and insights</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          /* No Posts */
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No posts available yet.</p>
          </div>
        ) : (
          /* Posts Grid */
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
              <article
                key={post._id}
                className="stagger-item group bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-800 cursor-pointer hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => handlePostClick(post._id)}
              >
                <div className="h-48 overflow-hidden bg-gray-200 dark:bg-slate-800">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.content.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>By {post.author?.name || 'Anonymous'}</span>
                      <span className="flex items-center gap-1">👁 {post.views || 0}</span>
                    </div>
                    <span className="font-medium text-blue-600">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all posts →
          </button>
        </div>
      </section>

      {/* Video Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-slate-950 dark:text-white mb-6">
          Watch our intro video
        </h2>
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <YouTubeEmbed videoId="dQw4w9WgXcQ" className="mx-auto" />
          <YouTubeEmbed videoId="dQw4w9WgXcQ" className="mx-auto" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: `${blogPosts.length}+`, label: "Articles Published" },
              { number: "50K+", label: "Monthly Readers" },
              { number: "5", label: "Years Active" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-5xl font-bold text-blue-400 mb-2">{stat.number}</p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
