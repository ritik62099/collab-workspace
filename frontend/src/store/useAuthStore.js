import { create } from 'zustand';
import { authService } from '../services/authService';
import { storage, STORAGE_KEYS } from '../utils/storage';

export const useAuthStore = create((set) => ({
  user: storage.getItem(STORAGE_KEYS.USER) || null,
  token: storage.getItem(STORAGE_KEYS.TOKEN) || null,
  isAuthenticated: !!storage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        loading: false 
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await authService.logout();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },

  // Update user
  updateUser: (user) => {
    set({ user });
    storage.setItem(STORAGE_KEYS.USER, user);
  },

  // Clear error
  clearError: () => set({ error: null }),
}));