import { create } from 'zustand';
import { workspaceService } from '../services/workspaceService';

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const data = await workspaceService.getAll();
      set({ workspaces: data.workspaces, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch workspaces', loading: false });
    }
  },

  fetchWorkspaceById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await workspaceService.getById(id);
      set({ currentWorkspace: data.workspace, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch workspace', loading: false });
    }
  },

  createWorkspace: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await workspaceService.create(data);
      set((state) => ({ 
        workspaces: [res.workspace, ...state.workspaces],
        loading: false 
      }));
      return res.workspace;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create workspace', loading: false });
      throw error;
    }
  },

  updateWorkspace: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await workspaceService.update(id, data);
      set((state) => ({
        workspaces: state.workspaces.map((ws) => (ws._id === id ? res.workspace : ws)),
        currentWorkspace: res.workspace,
        loading: false
      }));
      return res.workspace;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update workspace', loading: false });
      throw error;
    }
  },

  deleteWorkspace: async (id) => {
    set({ loading: true, error: null });
    try {
      await workspaceService.delete(id);
      set((state) => ({
        workspaces: state.workspaces.filter((ws) => ws._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete workspace', loading: false });
      throw error;
    }
  },

  // ✅ YE FUNCTION ADD KIYA HAI (Jo WorkspaceList mein use ho raha tha)
  joinWorkspace: async (code) => {
    set({ loading: true, error: null });
    try {
      const res = await workspaceService.joinByCode(code);
      set((state) => ({
        workspaces: [res.workspace, ...state.workspaces],
        loading: false
      }));
      return res.workspace;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to join workspace', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));