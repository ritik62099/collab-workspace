import api from './api';

export const searchService = {
  // Global search
  globalSearch: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const response = await api.get(`/search?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get search suggestions (autocomplete)
  getSuggestions: async (query) => {
    try {
      const response = await api.get(`/search/suggestions?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
