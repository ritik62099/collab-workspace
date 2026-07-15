import { logger } from '../utils/logger.js';

export const registerPresenceEvents = (io, socket) => {
  // Get online users in a board
  socket.on('get-online-users', async (boardId) => {
    const sockets = await io.in(`board-${boardId}`).fetchSockets();
    const users = sockets.map((s) => ({
      _id: s.user._id,
      name: s.user.name,
      avatar: s.user.avatar,
    }));

    socket.emit('online-users', users);
  });
};