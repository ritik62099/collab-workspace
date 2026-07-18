import { create } from 'zustand';
import { boardService } from '../services/boardService';

export const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  lists: [],
  loading: false,
  error: null,

  // Fetch board with lists and cards
  fetchBoard: async (boardId) => {
    set({ loading: true });
    try {
      const data = await boardService.getById(boardId);
      set({ 
        currentBoard: data.board, 
        lists: data.lists, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create List
  addList: async (data) => {
    try {
      const res = await boardService.createList(data);
      set((state) => ({ 
        lists: [...state.lists, res.list] 
      }));
    } catch (error) {
      throw error;
    }
  },

  // Update List
  updateList: async (id, data) => {
    try {
      const res = await boardService.updateList(id, data);
      set((state) => ({
        lists: state.lists.map((list) => 
          list._id === id ? res.list : list
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Delete List
  deleteList: async (id) => {
    try {
      await boardService.deleteList(id);
      set((state) => ({
        lists: state.lists.filter((list) => list._id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Add Card
  addCard: async (data) => {
    try {
      const res = await boardService.createCard(data);
      set((state) => ({
        lists: state.lists.map((list) => 
          list._id === data.listId 
            ? { ...list, cards: [...list.cards, res.card] } 
            : list
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Move Card (Drag & Drop)
  moveCard: async (cardId, fromListId, toListId, newIndex) => {
    // Optimistic update (UI pehle update hoga)
    set((state) => {
      const newLists = state.lists.map((list) => {
        if (list._id === fromListId) {
          return {
            ...list,
            cards: list.cards.filter((c) => c._id !== cardId),
          };
        }
        if (list._id === toListId) {
          const card = state.lists
            .find((l) => l._id === fromListId)
            ?.cards.find((c) => c._id === cardId);
          
          if (!card) return list;
          
          const newCards = [...list.cards];
          newCards.splice(newIndex, 0, { ...card, list: toListId });
          return { ...list, cards: newCards };
        }
        return list;
      });
      return { lists: newLists };
    });

    // Backend call
    try {
      await boardService.moveCard(cardId, toListId, newIndex);
    } catch (error) {
      // Rollback on error (optional but recommended)
      console.error('Failed to move card:', error);
      get().fetchBoard(get().currentBoard?._id); 
    }
  },

  // Delete Card
  deleteCard: async (cardId, listId) => {
    try {
      await boardService.deleteCard(cardId);
      set((state) => ({
        lists: state.lists.map((list) =>
          list._id === listId
            ? { ...list, cards: list.cards.filter((c) => c._id !== cardId) }
            : list
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  setCurrentBoard: (board) => set({ currentBoard: board }),
}));