import { create } from 'zustand';
import { chatService } from '../services/chatService';

export const useChatStore = create((set) => ({
  conversations: [],
  selectedUser: null,
  messages: [],
  users: [],
  loading: false,
  typingUsers: {}, // { userId: isTyping }

  // Fetch conversations
  fetchConversations: async () => {
    set({ loading: true });
    try {
      const data = await chatService.getConversations();
      set({ conversations: data.conversations, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch conversations:', error);
    }
  },

  // Fetch all users
  fetchUsers: async () => {
    try {
      const data = await chatService.getAllUsers();
      set({ users: data.users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  // Fetch messages with a user
  fetchMessages: async (userId) => {
    set({ loading: true });
    try {
      const data = await chatService.getMessages(userId);
      set({ messages: data.messages, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch messages:', error);
    }
  },

  // Send message
  sendMessage: async (receiverId, content) => {
    try {
      const data = await chatService.sendMessage(receiverId, content);
      set((state) => ({
        messages: [...state.messages, data.message],
      }));
      return data.message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  // Set selected user
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Add message to state
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  // Set typing status
  setTyping: (userId, isTyping) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [userId]: isTyping,
      },
    })),

  // Clear messages
  clearMessages: () => set({ messages: [] }),
}));