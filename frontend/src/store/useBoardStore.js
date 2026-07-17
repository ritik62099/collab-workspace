import { create } from 'zustand';
import { boardService } from '../services/boardService';

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
      throw error;
    }
  },

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
