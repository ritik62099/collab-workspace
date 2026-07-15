import Notification from '../models/Notification.js';
import { SOCKET_EVENTS } from '../utils/constants.js';

export const createNotification = async (notificationData, io) => {
  try {
    const notification = await Notification.create(notificationData);

    // Populate sender details
    await notification.populate('sender', 'name avatar');

    // Emit socket event to recipient
    if (io) {
      io.to(`user-${notification.recipient}`).emit(
        SOCKET_EVENTS.NOTIFICATION,
        notification
      );
    }

    return notification;
  } catch (error) {
    console.error('Notification error:', error);
    return null;
  }
};

export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ recipient: userId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ recipient: userId });
  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  return {
    notifications,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
    unreadCount,
  };
};

export const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};