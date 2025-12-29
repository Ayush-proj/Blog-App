import api from './api';

/**
 * 📝 POST SERVICE
 * 
 * Handles all blog post-related API calls
 * - CRUD operations for posts
 * - Like/Unlike posts
 * - Filter and search posts
 * - Get posts by category
 */

const postService = {
  /**
   * Get all posts with optional filters
   * @param {Object} filters - { category, search, published }
   * @returns {Promise} - { success, count, data: [posts] }
   */
  getAllPosts: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.published !== undefined) queryParams.append('published', filters.published);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/posts?${queryString}` : '/posts';
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single post by ID
   * @param {string} postId - Post ID
   * @returns {Promise} - { success, data: post }
   */
  getPostById: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get posts by category
   * @param {string} category - Category name
   * @returns {Promise} - { success, count, data: [posts] }
   */
  getPostsByCategory: async (category) => {
    try {
      const response = await api.get(`/posts/category/${category}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new post (requires authentication)
   * @param {Object} postData - { title, content, category, tags, published, image }
   * @returns {Promise} - { success, message, data: post }
   */
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing post (requires authentication)
   * @param {string} postId - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise} - { success, message, data: post }
   */
  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a post (requires authentication)
   * @param {string} postId - Post ID
   * @returns {Promise} - { success, message }
   */
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Like a post (requires authentication)
   * @param {string} postId - Post ID
   * @returns {Promise} - { success, message, data: { likesCount } }
   */
  likePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Unlike a post (requires authentication)
   * @param {string} postId - Post ID
   * @returns {Promise} - { success, message, data: { likesCount } }
   */
  unlikePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default postService;
