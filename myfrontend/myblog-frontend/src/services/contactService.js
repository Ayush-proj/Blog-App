import api from './api';

export const contactService = {
  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },

  // Get all messages (admin only)
  getAllMessages: async () => {
    try {
      const response = await api.get('/contact');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch messages' };
    }
  },

  // Mark message as read (admin only)
  markAsRead: async (messageId) => {
    try {
      const response = await api.put(`/contact/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark message as read' };
    }
  },

  // Delete message (admin only)
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/contact/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete message' };
    }
  }
};

export default contactService;
