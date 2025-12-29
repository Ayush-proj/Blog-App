import axios from 'axios';

/**
 * 🔧 AXIOS INSTANCE CONFIGURATION
 * 
 * This is the central API client for the entire application.
 * All HTTP requests go through this configured instance.
 * 
 * Benefits:
 * - Single source of truth for base URL
 * - Automatic token attachment to requests
 * - Global error handling
 * - Request/Response logging
 */

// Base URL - change this based on environment
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 📤 REQUEST INTERCEPTOR
 * 
 * Runs BEFORE every request is sent
 * Purpose: Attach JWT token to all requests automatically
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    // Handle request error
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 📥 RESPONSE INTERCEPTOR
 * 
 * Runs AFTER every response is received
 * Purpose: Handle errors globally and format responses
 */
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.url, response.data);
    }
    
    // Return just the data portion
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    
    // 1. Network Error (no internet)
    if (!error.response) {
      console.error('🌐 Network Error: No internet connection');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        type: 'network',
      });
    }
    
    // 2. Server responded with error status
    const { status, data } = error.response;
    
    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        console.error('🔒 Unauthorized: Invalid or expired token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
        
      case 403:
        console.error('🚫 Forbidden: You don\'t have permission');
        break;
        
      case 404:
        console.error('🔍 Not Found: Resource doesn\'t exist');
        break;
        
      case 500:
        console.error('💥 Server Error: Something went wrong on the server');
        break;
        
      default:
        console.error(`❌ Error ${status}:`, data?.message);
    }
    
    // Return formatted error
    return Promise.reject({
      message: data?.message || 'Something went wrong',
      status,
      data,
    });
  }
);

export default api;
