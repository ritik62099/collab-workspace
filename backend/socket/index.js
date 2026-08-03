import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { registerBoardEvents } from './boardEvents.js';
import { registerCardEvents } from './cardEvents.js';
import { registerCommentEvents } from './commentEvents.js';
import { registerPresenceEvents } from './presenceEvents.js';
import { logger } from '../utils/logger.js';
import { registerChatEvents } from './chatEvents.js';

export const initializeSocket = (io) => {
  // Authentication middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      const user = await User.findById(decoded.id).select('name avatar');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    logger.success(`User connected: ${socket.user.name} (${socket.id})`);

    // Join user's personal room for notifications
    socket.join(`user-${socket.user._id}`);

    // Register all event handlers
    registerBoardEvents(io, socket);
    registerCardEvents(io, socket);
    registerCommentEvents(io, socket);
    registerPresenceEvents(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.user.name} - ${reason}`);
    });
  });

  

  io.on('connection', (socket) => {
    logger.success(`User connected: ${socket.user.name} (${socket.id})`);

    // Join user's personal room for notifications
    socket.join(`user-${socket.user._id}`);
    
    // ✅ Join chat room
    socket.join(`chat-${socket.user._id}`);

    // Register all event handlers
    registerBoardEvents(io, socket);
    registerCardEvents(io, socket);
    registerCommentEvents(io, socket);
    registerPresenceEvents(io, socket);
    registerChatEvents(io, socket); // ✅ Ye line add karo

    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.user.name} - ${reason}`);
    });
  });

  logger.success('Socket.io initialized');
};