import api from './api';

export const listService = {
  // Create list
  createList: async (data) => {
    const response = await api.post('/lists', data);
    return response.data;
  },

  // Update list
  updateList: async (id, data) => {
    const response = await api.put(`/lists/${id}`, data);
    return response.data;
  },

  // Delete list
  deleteList: async (id) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
  },

  // Reorder list
  reorderList: async (id, newIndex) => {
    const response = await api.put(`/lists/${id}/reorder`, { newIndex });
    return response.data;
  },
};
