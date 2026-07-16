import { create } from 'zustand';
import { authService } from '../services/authService';
import { config } from '../config/env';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state from localStorage
  initAuth: () => {
    try {
      const token = localStorage.getItem(config.tokenKey);
      const user = localStorage.getItem('collab_user');
      
      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  // Login
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authService.login(credentials);
      
      localStorage.setItem(config.tokenKey, data.token);
      localStorage.setItem('collab_user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Register
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authService.register(userData);
      
      localStorage.setItem(config.tokenKey, data.token);
      localStorage.setItem('collab_user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem('collab_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Fetch current user
  fetchUser: async () => {
    try {
      const data = await authService.getMe();
      set({ user: data.user });
      localStorage.setItem('collab_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
