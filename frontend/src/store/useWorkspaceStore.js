import { create } from 'zustand';
import { workspaceService } from '../services/workspaceService';

const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  // Fetch all workspaces
  fetchWorkspaces: async () => {
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
    }
  },

  // Create workspace
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
      throw error;
    }
  },

  // Update workspace
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
      throw error;
    }
  },

  // Delete workspace
  deleteWorkspace: async (id) => {
    try {
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
      throw error;
    }
  },

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
