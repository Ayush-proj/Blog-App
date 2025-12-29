import { create } from 'zustand';

/**
 * 🔔 TOAST NOTIFICATION STORE
 * 
 * Manages toast notifications for user feedback
 * - Success messages
 * - Error messages
 * - Info messages
 * - Warning messages
 * 
 * Auto-dismisses after 5 seconds by default
 */

export const useToastStore = create((set, get) => ({
  // STATE
  toasts: [], // Array of toast objects

  // ACTIONS

  /**
   * Add a new toast notification
   * @param {Object} toast - { message, type, duration }
   */
  addToast: (toast) => {
    const id = Date.now();
    const newToast = {
      id,
      message: toast.message,
      type: toast.type || 'info', // success, error, warning, info
      duration: toast.duration || 5000, // 5 seconds default
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss after duration
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);

    return id;
  },

  /**
   * Remove a toast by ID
   * @param {number} id - Toast ID
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  /**
   * Clear all toasts
   */
  clearToasts: () => {
    set({ toasts: [] });
  },

  // HELPER METHODS (shortcuts for different toast types)

  /**
   * Show success toast
   * @param {string} message
   */
  success: (message) => {
    get().addToast({ message, type: 'success' });
  },

  /**
   * Show error toast
   * @param {string} message
   */
  error: (message) => {
    get().addToast({ message, type: 'error' });
  },

  /**
   * Show info toast
   * @param {string} message
   */
  info: (message) => {
    get().addToast({ message, type: 'info' });
  },

  /**
   * Show warning toast
   * @param {string} message
   */
  warning: (message) => {
    get().addToast({ message, type: 'warning' });
  },
}));
