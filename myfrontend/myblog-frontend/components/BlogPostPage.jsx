import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { BlogPostSkeleton, CommentSkeleton } from '../src/components/Skeleton';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastStore();
  const { token, user } = useAuthStore();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  // Comment states
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.svg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3001${imageUrl}`;
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('Post not found');
      }
      
      const result = await response.json();
      setPost(result.data || result);
      
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Error fetching post:', error);
      setTimeout(() => navigate('/blog'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await fetch(`http://localhost:3001/api/comments/post/${id}`);
      
      if (response.ok) {
        const result = await response.json();
        setComments(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setSubmittingComment(true);
      
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: id,
          content: commentText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const result = await response.json();
      
      setComments([result.data, ...comments]);
      setCommentText('');
      toast.success('Comment added successfully!');
      
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully!');
      
    } catch (error) {
      toast.error(error.message || 'Failed to delete comment');
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast.error('Please login to like posts');
      navigate('/login');
      return;
    }

    try {
      setLiking(true);
      
      const response = await fetch(`http://localhost:3001/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like post');
      }

      const result = await response.json();
      setPost(result.data);
      toast.success('Post liked!');
      
    } catch (error) {
      toast.error(error.message || 'Failed to like post');
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      toast.success('Post deleted successfully!');
      navigate('/blog');
      
    } catch (error) {
      toast.error(error.message || 'Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-20">
        <BlogPostSkeleton />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  console.log('Current user:', user);
console.log('Post author:', post.author);
console.log('User ID:', user?._id);
console.log('Author ID:', post.author?._id);
console.log('Match:', user && post.author?._id === user.id);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
              {post.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  post.author?.name?.charAt(0).toUpperCase() || 'A'
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.author?.name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.views || 0} views
                </p>
              </div>
            </div>

            <button
              onClick={handleLike}
              disabled={liking}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xl">❤️</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {post.likesCount || 0}
              </span>
            </button>
          </div>

          {/* Edit/Delete Buttons (Only for post author) */}
          {user && post.author?._id === user.id && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => navigate(`/edit-post/${post._id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ✏️ Edit Post
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                🗑️ Delete Post
              </button>
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={getImageUrl(post.image)}
              alt={post.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.svg';
              }}
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-gray-200 dark:border-slate-800 mb-12" />

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {token ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-semibold underline hover:text-blue-600"
                >
                  login
                </button>{' '}
                to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                        {comment.author?.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          comment.author?.name?.charAt(0).toUpperCase() || 'A'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {comment.author?.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {user && comment.author?._id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </section>
      </article>
    </div>
  );
};

export default BlogPostPage;
