import { io } from 'socket.io-client';
import env from '../config/env';
import { storage, STORAGE_KEYS } from '../utils/storage';

let socket = null;

export const socketService = {
  // Initialize connection
  connect: () => {
    if (socket?.connected) return socket;

    const token = storage.getItem(STORAGE_KEYS.TOKEN);
    
    socket = io(env.SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return socket;
  },

  // Get socket instance
  getSocket: () => {
    if (!socket) {
      return socketService.connect();
    }
    return socket;
  },

  // Disconnect
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};

export default socketService;