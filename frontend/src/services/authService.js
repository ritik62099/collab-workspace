import api from './api';
<<<<<<< HEAD
import { storage, STORAGE_KEYS } from '../utils/storage';
=======
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c

export const authService = {
  // Register new user
  register: async (userData) => {
<<<<<<< HEAD
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        // Save token and user data
        storage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        storage.setItem(STORAGE_KEYS.USER, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
=======
    const response = await api.post('/auth/register', userData);
    return response.data;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  },

  // Login user
  login: async (credentials) => {
<<<<<<< HEAD
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        // Save token and user data
        storage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        storage.setItem(STORAGE_KEYS.USER, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless
      storage.removeItem(STORAGE_KEYS.TOKEN);
      storage.removeItem(STORAGE_KEYS.USER);
    }
=======
    const response = await api.post('/auth/login', credentials);
    return response.data;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  },

  // Get current user
  getMe: async () => {
<<<<<<< HEAD
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
=======
    const response = await api.get('/auth/me');
    return response.data;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  },

  // Update profile
  updateProfile: async (profileData) => {
<<<<<<< HEAD
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        storage.setItem(STORAGE_KEYS.USER, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
=======
    const response = await api.put('/auth/profile', profileData);
    return response.data;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  },

  // Change password
  changePassword: async (passwordData) => {
<<<<<<< HEAD
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
=======
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
};
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
