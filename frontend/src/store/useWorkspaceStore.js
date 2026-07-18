import { create } from 'zustand';
import { workspaceService } from '../services/workspaceService';

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,

  // Fetch all workspaces
  fetchWorkspaces: async () => {
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
    }
  },

  // Create workspace
  createWorkspace: async (data) => {
    try {
      const res = await workspaceService.create(data);
      set((state) => ({ 
        workspaces: [res.workspace, ...state.workspaces] 
      }));
      return res;
    } catch (error) {
      throw error;
    }
  },

  // Update workspace
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
      throw error;
    }
  },

  // Delete workspace
  deleteWorkspace: async (id) => {
    try {
      await workspaceService.delete(id);
      set((state) => ({
        workspaces: state.workspaces.filter((ws) => ws._id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));