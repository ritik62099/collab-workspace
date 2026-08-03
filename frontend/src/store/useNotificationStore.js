import { create } from 'zustand';
import { notificationService } from '../services/notificationService';


export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  // Fetch notifications
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await notificationService.getAll();
      set({ 
        notifications: data.notifications || [], 
        unreadCount: data.unreadCount || 0, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Accept Invite
  acceptInvite: async (id) => {
    try {
      await notificationService.acceptInvite(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Reject Invite
  rejectInvite: async (id) => {
    try {
      await notificationService.rejectInvite(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Mark as read
  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) => 
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  clearError: () => set({ error: null }),
}));