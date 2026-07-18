import { create } from 'zustand';
import { boardService } from '../services/boardService';

<<<<<<< HEAD
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
=======
const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  currentBoardLists: [], // Add lists from current board
  isLoading: false,
  error: null,

  // Fetch boards by workspace
  fetchBoardsByWorkspace: async (workspaceId) => {
    try {
      set({ isLoading: true, error: null });
      const data = await boardService.getBoardsByWorkspace(workspaceId);
      set({ boards: data.boards, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch boards', 
        isLoading: false 
      });
    }
  },

  // Fetch board by ID
  fetchBoardById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const data = await boardService.getBoardById(id);
      set({ 
        currentBoard: data.board, 
        currentBoardLists: data.lists || [], 
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch board', 
        isLoading: false 
      });
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      throw error;
    }
  },

<<<<<<< HEAD
  setCurrentBoard: (board) => set({ currentBoard: board }),
}));
=======
  // Create board
  createBoard: async (boardData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await boardService.createBoard(boardData);
      set((state) => ({
        boards: [data.board, ...state.boards],
        isLoading: false,
      }));
      return data.board;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create board', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Update board
  updateBoard: async (id, boardData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await boardService.updateBoard(id, boardData);
      set((state) => ({
        boards: state.boards.map((b) =>
          b._id === id ? data.board : b
        ),
        currentBoard: state.currentBoard?._id === id ? data.board : state.currentBoard,
        isLoading: false,
      }));
      return data.board;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update board', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Delete board
  deleteBoard: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await boardService.deleteBoard(id);
      set((state) => ({
        boards: state.boards.filter((b) => b._id !== id),
        currentBoard: state.currentBoard?._id === id ? null : state.currentBoard,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete board', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear boards
  clearBoards: () => set({ boards: [] }),

  // Clear current board
  clearCurrentBoard: () => set({ currentBoard: null, currentBoardLists: [] }),
}));

export default useBoardStore;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
