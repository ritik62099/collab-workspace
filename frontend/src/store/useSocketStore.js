import { create } from 'zustand';
import socketService from '../services/socketService';

export const useSocketStore = create((set) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],

  // Initialize socket
  initSocket: () => {
    const socket = socketService.connect();
    set({ socket, isConnected: true });

    socket.on('disconnect', () => set({ isConnected: false }));
    socket.on('connect', () => set({ isConnected: true }));
  },

  // Disconnect socket
  disconnectSocket: () => {
    socketService.disconnect();
    set({ socket: null, isConnected: false });
  },

  // Join board room
  joinBoard: (boardId) => {
    const { socket } = get();
    if (socket) {
      socket.emit('join-board', boardId);
    }
  },

  // Leave board room
  leaveBoard: (boardId) => {
    const { socket } = get();
    if (socket) {
      socket.emit('leave-board', boardId);
    }
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));