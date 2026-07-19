import { SOCKET_EVENTS } from '../utils/constants.js';

export const registerCardEvents = (io, socket) => {
  socket.on(SOCKET_EVENTS.CARD_CREATED, (data) => {
    // Broadcast to everyone in the board room EXCEPT the sender
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.CARD_CREATED, {
      ...data,
      user: {
        _id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
    });
  });

  socket.on(SOCKET_EVENTS.CARD_MOVED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.CARD_MOVED, data);
  });
};