import axios from 'axios';
<<<<<<< HEAD
import env from '../config/env';
import { storage, STORAGE_KEYS } from '../utils/storage';

// Create axios instance
const api = axios.create({
  baseURL: env.API_URL,
=======
import { config } from '../config/env';

const api = axios.create({
  baseURL: config.apiUrl,
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem(STORAGE_KEYS.TOKEN);
=======
// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('collab_token');
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
// Response interceptor - Handle errors
=======
// Response interceptor to handle errors
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
<<<<<<< HEAD
      // Clear auth data
      storage.removeItem(STORAGE_KEYS.TOKEN);
      storage.removeItem(STORAGE_KEYS.USER);
      // Redirect to login
=======
      localStorage.removeItem('collab_token');
      localStorage.removeItem('collab_user');
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
