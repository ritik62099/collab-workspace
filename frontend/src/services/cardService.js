import api from './api';

export const cardService = {
  // Create card
  createCard: async (data) => {
    const response = await api.post('/cards', data);
    return response.data;
  },

  // Get card by ID
  getCardById: async (id) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  // Update card
  updateCard: async (id, data) => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data;
  },

  // Move card
  moveCard: async (id, toListId, newIndex) => {
    const response = await api.put(`/cards/${id}/move`, { toListId, newIndex });
    return response.data;
  },

  // Delete card
  deleteCard: async (id) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },
};
