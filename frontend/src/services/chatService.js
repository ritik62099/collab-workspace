import api from './api';

export const chatService = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/chat/users');
    return response.data;
  },

  // Get messages with a specific user
  getMessages: async (userId) => {
    const response = await api.get(`/chat/messages/${userId}`);
    return response.data;
  },

  // Send message
  sendMessage: async (receiverId, content) => {
    const response = await api.post('/chat/send', {
      receiverId,
      content,
    });
    return response.data;
  },
};

export default chatService;