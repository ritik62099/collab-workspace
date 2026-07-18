import { create } from 'zustand';
import { authService } from '../services/authService';
<<<<<<< HEAD
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
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    }
  },

  // Register
  register: async (userData) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    }
  },

  // Logout
<<<<<<< HEAD
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
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  },

  // Clear error
  clearError: () => set({ error: null }),
<<<<<<< HEAD
}));
=======
}));

export default useAuthStore;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
