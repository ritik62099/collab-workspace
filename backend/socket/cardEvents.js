import { SOCKET_EVENTS } from '../utils/constants.js';

export const registerCardEvents = (io, socket) => {
  socket.on(SOCKET_EVENTS.CARD_CREATED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.CARD_CREATED, {
      ...data,
      user: {
        _id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
    });
  });

  socket.on(SOCKET_EVENTS.CARD_UPDATED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.CARD_UPDATED, {
      ...data,
      user: {
        _id: socket.user._id,
        name: socket.user.name,
      },
    });
  });

  socket.on(SOCKET_EVENTS.CARD_MOVED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.CARD_MOVED, data);
  });

  socket.on(SOCKET_EVENTS.CARD_DELETED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.CARD_DELETED, data);
  });
};