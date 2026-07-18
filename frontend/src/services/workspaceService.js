import api from './api';

export const workspaceService = {
<<<<<<< HEAD
  // Get all workspaces
  getAll: async () => {
=======
  // Create workspace
  createWorkspace: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  // Get all user's workspaces
  getWorkspaces: async () => {
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.get('/workspaces');
    return response.data;
  },

  // Get workspace by ID
<<<<<<< HEAD
  getById: async (id) => {
=======
  getWorkspaceById: async (id) => {
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

<<<<<<< HEAD
  // Create workspace
  create: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  // Update workspace
  update: async (id, data) => {
=======
  // Update workspace
  updateWorkspace: async (id, data) => {
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  // Delete workspace
<<<<<<< HEAD
  delete: async (id) => {
=======
  deleteWorkspace: async (id) => {
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  // Invite member
  inviteMember: async (id, data) => {
    const response = await api.post(`/workspaces/${id}/invite`, data);
    return response.data;
  },

<<<<<<< HEAD
  // Join via invite code
  joinByCode: async (code) => {
=======
  // Join by invite code
  joinByInviteCode: async (code) => {
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.post(`/workspaces/join/${code}`);
    return response.data;
  },
};
<<<<<<< HEAD

export default workspaceService;
=======
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
