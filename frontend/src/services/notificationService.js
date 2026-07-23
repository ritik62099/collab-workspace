import api from './api';

export const notificationService = {
  // Get all notifications
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Accept Workspace Invite
  acceptInvite: async (id) => {
    const response = await api.post(`/notifications/${id}/accept-invite`);
    return response.data;
  },

  // Reject Workspace Invite
  rejectInvite: async (id) => {
    const response = await api.post(`/notifications/${id}/reject-invite`);
    return response.data;
  },
};

export default notificationService;