import api from './api';

export const workspaceService = {
  // Create workspace
  createWorkspace: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  // Get all user's workspaces
  getWorkspaces: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  // Get workspace by ID
  getWorkspaceById: async (id) => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  // Update workspace
  updateWorkspace: async (id, data) => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  // Delete workspace
  deleteWorkspace: async (id) => {
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  // Invite member
  inviteMember: async (id, data) => {
    const response = await api.post(`/workspaces/${id}/invite`, data);
    return response.data;
  },

  // Join by invite code
  joinByInviteCode: async (code) => {
    const response = await api.post(`/workspaces/join/${code}`);
    return response.data;
  },
};
