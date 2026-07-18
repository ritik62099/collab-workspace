import { create } from 'zustand';
import { cardService } from '../services/cardService';

const useCardStore = create((set, get) => ({
  currentCard: null,
  isLoading: false,
  error: null,

  // Fetch card by ID
  fetchCardById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const data = await cardService.getCardById(id);
      set({ currentCard: data.card, isLoading: false });
      return data.card;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch card', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Create card
  createCard: async (cardData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await cardService.createCard(cardData);
      set({ isLoading: false });
      return data.card;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create card', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Update card
  updateCard: async (id, cardData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await cardService.updateCard(id, cardData);
      set((state) => ({
        currentCard: state.currentCard?._id === id ? data.card : state.currentCard,
        isLoading: false,
      }));
      return data.card;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update card', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Move card
  moveCard: async (id, toListId, newIndex) => {
    try {
      await cardService.moveCard(id, toListId, newIndex);
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to move card' });
      throw error;
    }
  },

  // Delete card
  deleteCard: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await cardService.deleteCard(id);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete card', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current card
  clearCurrentCard: () => set({ currentCard: null }),
}));

export default useCardStore;
