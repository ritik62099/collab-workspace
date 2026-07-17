import { create } from 'zustand';
import { listService } from '../services/listService';

const useListStore = create((set, get) => ({
  lists: [],
  isLoading: false,
  error: null,

  // Set lists from board fetch
  setLists: (lists) => set({ lists }),

  // Create list
  createList: async (listData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await listService.createList(listData);
      set((state) => ({
        lists: [...state.lists, { ...data.list, cards: [] }],
        isLoading: false,
      }));
      return data.list;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create list', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Update list
  updateList: async (id, listData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await listService.updateList(id, listData);
      set((state) => ({
        lists: state.lists.map((list) =>
          list._id === id ? { ...list, ...data.list } : list
        ),
        isLoading: false,
      }));
      return data.list;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update list', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Delete list
  deleteList: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await listService.deleteList(id);
      set((state) => ({
        lists: state.lists.filter((list) => list._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete list', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Reorder lists
  reorderLists: (sourceIndex, destinationIndex) => {
    set((state) => {
      const newLists = Array.from(state.lists);
      const [removed] = newLists.splice(sourceIndex, 1);
      newLists.splice(destinationIndex, 0, removed);
      return { lists: newLists };
    });
  },

  // Add card to list
  addCardToList: (listId, card) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list._id === listId
          ? { ...list, cards: [...(list.cards || []), card] }
          : list
      ),
    }));
  },

  // Update card in list
  updateCardInList: (listId, cardId, updatedCard) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list._id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card._id === cardId ? { ...card, ...updatedCard } : card
              ),
            }
          : list
      ),
    }));
  },

  // Remove card from list
  removeCardFromList: (listId, cardId) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list._id === listId
          ? { ...list, cards: list.cards.filter((card) => card._id !== cardId) }
          : list
      ),
    }));
  },

  // Move card between lists
  moveCardBetweenLists: (fromListId, toListId, cardId, toIndex) => {
    set((state) => {
      const newLists = state.lists.map((list) => ({
        ...list,
        cards: [...(list.cards || [])],
      }));

      const fromList = newLists.find((list) => list._id === fromListId);
      const toList = newLists.find((list) => list._id === toListId);

      if (!fromList || !toList) return state;

      const cardIndex = fromList.cards.findIndex((card) => card._id === cardId);
      if (cardIndex === -1) return state;

      const [card] = fromList.cards.splice(cardIndex, 1);
      card.list = toListId;
      toList.cards.splice(toIndex, 0, card);

      return { lists: newLists };
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear lists
  clearLists: () => set({ lists: [] }),
}));

export default useListStore;
