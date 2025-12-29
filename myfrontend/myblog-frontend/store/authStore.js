import { create } from 'zustand';

/**
 * 🔐 AUTHENTICATION STORE (Zustand)
 * 
 * Manages authentication state across the entire app
 * - User data
 * - Authentication status
 * - Login/Logout actions
 * - Token management
 * 
 * 🎓 LEARNING: This store now uses DIRECT FETCH instead of services
 * - We make HTTP requests directly using fetch()
 * - No service layer - everything is here!
 * - Easy to understand and learn
 */

// 🎓 HELPER FUNCTIONS (like mini-services, but simpler)
const API_URL = 'http://localhost:3001/api';

// Get user from localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user'); // Clear corrupted data
    return null;
  }
};

// Get token from localStorage
const getToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

export const useAuthStore = create((set, get) => ({
  // STATE
  user: getCurrentUser(), // Load user from localStorage on init
  token: getToken(),
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,

  // ACTIONS

  /**
   * 🎓 LOGIN USER - Using Direct Fetch
   * 
   * Step 1: Make POST request to /api/auth/login
   * Step 2: Send email and password in body
   * Step 3: Get back user data and token
   * Step 4: Save to localStorage
   * Step 5: Update state
   */
  login: async (credentials) => {
    set({ loading: true, error: null });
    
    try {
      // 🎓 STEP 1: Make the fetch request
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials) // { email, password }
      });

      // 🎓 STEP 2: Check if request was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // 🎓 STEP 3: Get the data from response
      const data = await response.json();
      
      // 🎓 STEP 4: Save to localStorage
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
        // Continue anyway - state will still be updated
      }
      
      // 🎓 STEP 5: Update state
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  /**
   * 🎓 REGISTER USER - Using Direct Fetch
   * 
   * Same pattern as login:
   * 1. POST to /api/auth/register
   * 2. Send user data
   * 3. Get back user and token
   * 4. Save and update state
   */
  register: async (userData) => {
    set({ loading: true, error: null });
    
    try {
      // Make fetch request
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData) // { name, email, password }
      });

      // Check if successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Get data
      const data = await response.json();
      
      // Save to localStorage
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
        // Continue anyway - state will still be updated
      }
      
      // Update state
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      
      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.message || 'Registration failed',
      });
      throw error;
    }
  },

  /**
   * 🎓 LOGOUT USER
   * 
   * Simple: Just clear localStorage and state
   * No API call needed!
   */
  logout: () => {
    // Clear localStorage
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    // Clear state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Update user profile
   */
  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user in localStorage:', error);
    }
    set({ user: updatedUser });
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Check if user is authenticated (helper)
   */
  checkAuth: () => {
    const token = getToken();
    const user = getCurrentUser();
    
    set({
      user,
      token,
      isAuthenticated: !!token,
    });
  },
}));
