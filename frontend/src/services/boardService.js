import api from './api';

export const boardService = {
<<<<<<< HEAD
  // Get boards by workspace
  getByWorkspace: async (workspaceId) => {
    const response = await api.get(`/boards/workspace/${workspaceId}`);
    return response.data;
  },

  // Get board by ID (with lists and cards)
  getById: async (id) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  // Create board
  create: async (data) => {
=======
  // Create board
  createBoard: async (data) => {
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.post('/boards', data);
    return response.data;
  },

<<<<<<< HEAD
  // Update board
  update: async (id, data) => {
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  // Delete board
<<<<<<< HEAD
  delete: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },

  // --- List Operations ---
  createList: async (data) => {
    const response = await api.post('/lists', data);
    return response.data;
  },

  updateList: async (id, data) => {
    const response = await api.put(`/lists/${id}`, data);
    return response.data;
  },

  deleteList: async (id) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
  },

  reorderList: async (id, newIndex) => {
    const response = await api.put(`/lists/${id}/reorder`, { newIndex });
    return response.data;
  },

  // --- Card Operations ---
  createCard: async (data) => {
    const response = await api.post('/cards', data);
    return response.data;
  },

  updateCard: async (id, data) => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data;
  },

  moveCard: async (id, toListId, newIndex) => {
    const response = await api.put(`/cards/${id}/move`, { toListId, newIndex });
    return response.data;
  },

  deleteCard: async (id) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },

  // --- Comment Operations ---
  addComment: async (cardId, text) => {
    const response = await api.post(`/comments/cards/${cardId}`, { text });
    return response.data;
  },

  updateComment: async (commentId, text) => {
    const response = await api.put(`/comments/${commentId}`, { text });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default boardService;
=======
  deleteBoard: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },
};
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
