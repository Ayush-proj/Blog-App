import api from './api';

/**
 * 🔐 AUTHENTICATION SERVICE
 * 
 * Handles all authentication-related API calls
 * - User registration
 * - User login
 * - User logout
 * - Get current user profile
 * 
 * Each function returns a Promise with the API response
 */

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   * @returns {Promise} - { success, message, data: { user, token } }
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Store token and user in localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login existing user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { success, message, data: { user, token } }
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token and user in localStorage
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout current user
   * Clears token and user data from localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  /**
   * Get current logged-in user from localStorage
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
