import api from './api';

export const boardService = {
  // Create board
  createBoard: async (data) => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  // Get boards by workspace
  getBoardsByWorkspace: async (workspaceId) => {
    const response = await api.get(`/boards/workspace/${workspaceId}`);
    return response.data;
  },

  // Get board by ID
  getBoardById: async (id) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  // Update board
  updateBoard: async (id, data) => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  // Delete board
  deleteBoard: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },
};
