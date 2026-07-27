import api from './api';

export const workspaceService = {
  // Get all workspaces
  getAll: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  // Get workspace by ID
  getById: async (id) => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  // Create workspace
  create: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  // Update workspace
  update: async (id, data) => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  // Delete workspace
  delete: async (id) => {
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  // Invite member
  inviteMember: async (id, data) => {
    const response = await api.post(`/workspaces/${id}/invite`, data);
    return response.data;
  },

  // Join via invite code
  joinByCode: async (code) => {
    const response = await api.post(`/workspaces/join/${code}`);
    return response.data;
  },

    // Get workspace members
  getMembers: async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  // Update member role
  updateMemberRole: async (workspaceId, userId, role) => {
    const response = await api.put(`/workspaces/${workspaceId}/members/${userId}`, { role });
    return response.data;
  },

  // Remove member
  removeMember: async (workspaceId, userId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    return response.data;
  },
};

export default workspaceService;