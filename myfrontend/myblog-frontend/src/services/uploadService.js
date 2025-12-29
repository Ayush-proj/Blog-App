import api from './api';

/**
 * 📤 UPLOAD SERVICE
 * 
 * Handles file upload operations
 * - Upload images for blog posts
 */

const uploadService = {
  /**
   * Upload an image file
   * @param {File} file - Image file to upload
   * @param {Function} onProgress - Optional callback for upload progress
   * @returns {Promise} - { success, message, data: { url, filename } }
   */
  uploadImage: async (file, onProgress) => {
    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('image', file);

      // Configure request with progress tracking
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Add progress callback if provided
      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        };
      }

      const response = await api.post('/upload', formData, config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Validate image file before upload
   * @param {File} file - File to validate
   * @returns {Object} - { valid: boolean, error: string }
   */
  validateImage: (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'File size too large. Maximum size is 5MB.' 
      };
    }

    return { valid: true, error: null };
  },
};

export default uploadService;
