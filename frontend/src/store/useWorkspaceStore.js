import { create } from 'zustand';
import { workspaceService } from '../services/workspaceService';

<<<<<<< HEAD
export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
=======
const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  error: null,

  // Fetch all workspaces
  fetchWorkspaces: async () => {
<<<<<<< HEAD
    set({ loading: true });
    try {
      const data = await workspaceService.getAll();
      set({ workspaces: data.workspaces, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get workspace by ID
  fetchWorkspaceById: async (id) => {
    set({ loading: true });
    try {
      const data = await workspaceService.getById(id);
      set({ currentWorkspace: data.workspace, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
=======
    try {
      set({ isLoading: true, error: null });
      const data = await workspaceService.getWorkspaces();
      set({ workspaces: data.workspaces, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch workspaces', 
        isLoading: false 
      });
    }
  },

  // Fetch workspace by ID
  fetchWorkspaceById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const data = await workspaceService.getWorkspaceById(id);
      set({ currentWorkspace: data.workspace, isLoading: false });
      return data.workspace;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch workspace', 
        isLoading: false 
      });
      throw error;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    }
  },

  // Create workspace
<<<<<<< HEAD
  createWorkspace: async (data) => {
    try {
      const res = await workspaceService.create(data);
      set((state) => ({ 
        workspaces: [res.workspace, ...state.workspaces] 
      }));
      return res;
    } catch (error) {
=======
  createWorkspace: async (workspaceData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await workspaceService.createWorkspace(workspaceData);
      set((state) => ({
        workspaces: [data.workspace, ...state.workspaces],
        isLoading: false,
      }));
      return data.workspace;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create workspace', 
        isLoading: false 
      });
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      throw error;
    }
  },

  // Update workspace
<<<<<<< HEAD
  updateWorkspace: async (id, data) => {
    try {
      const res = await workspaceService.update(id, data);
      set((state) => ({
        workspaces: state.workspaces.map((ws) => 
          ws._id === id ? res.workspace : ws
        ),
        currentWorkspace: res.workspace,
      }));
      return res;
    } catch (error) {
=======
  updateWorkspace: async (id, workspaceData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await workspaceService.updateWorkspace(id, workspaceData);
      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w._id === id ? data.workspace : w
        ),
        currentWorkspace: state.currentWorkspace?._id === id ? data.workspace : state.currentWorkspace,
        isLoading: false,
      }));
      return data.workspace;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update workspace', 
        isLoading: false 
      });
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      throw error;
    }
  },

  // Delete workspace
  deleteWorkspace: async (id) => {
    try {
<<<<<<< HEAD
      await workspaceService.delete(id);
      set((state) => ({
        workspaces: state.workspaces.filter((ws) => ws._id !== id),
      }));
    } catch (error) {
=======
      set({ isLoading: true, error: null });
      await workspaceService.deleteWorkspace(id);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w._id !== id),
        currentWorkspace: state.currentWorkspace?._id === id ? null : state.currentWorkspace,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete workspace', 
        isLoading: false 
      });
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      throw error;
    }
  },

<<<<<<< HEAD
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));
=======
  // Join workspace by code
  joinWorkspace: async (code) => {
    try {
      set({ isLoading: true, error: null });
      const data = await workspaceService.joinByInviteCode(code);
      set((state) => ({
        workspaces: [data.workspace, ...state.workspaces],
        isLoading: false,
      }));
      return data.workspace;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to join workspace', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current workspace
  clearCurrentWorkspace: () => set({ currentWorkspace: null }),
}));

export default useWorkspaceStore;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
