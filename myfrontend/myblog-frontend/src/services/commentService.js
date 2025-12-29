import api from './api';

/**
 * 💬 COMMENT SERVICE
 * 
 * Handles all comment-related API calls
 * - Get comments for a post
 * - Create new comment
 * - Delete comment
 */

const commentService = {
  /**
   * Get all comments for a specific post
   * @param {string} postId - Post ID
   * @returns {Promise} - { success, count, data: [comments] }
   */
  getCommentsByPost: async (postId) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new comment (requires authentication)
   * @param {string} postId - Post ID
   * @param {string} content - Comment content
   * @returns {Promise} - { success, message, data: comment }
   */
  createComment: async (postId, content) => {
    try {
      const response = await api.post('/comments', { postId, content });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a comment (requires authentication)
   * @param {string} commentId - Comment ID
   * @returns {Promise} - { success, message }
   */
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default commentService;
