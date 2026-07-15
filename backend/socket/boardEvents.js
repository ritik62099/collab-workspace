import { SOCKET_EVENTS } from '../utils/constants.js';

export const registerBoardEvents = (io, socket) => {
  // Join board room
  socket.on(SOCKET_EVENTS.JOIN_BOARD, (boardId) => {
    socket.join(`board-${boardId}`);
    socket.to(`board-${boardId}`).emit(SOCKET_EVENTS.USER_JOINED, {
      userId: socket.user._id,
      userName: socket.user.name,
      userAvatar: socket.user.avatar,
    });
  });

  // Leave board room
  socket.on(SOCKET_EVENTS.LEAVE_BOARD, (boardId) => {
    socket.leave(`board-${boardId}`);
    socket.to(`board-${boardId}`).emit(SOCKET_EVENTS.USER_LEFT, {
      userId: socket.user._id,
    });
  });

  // List events
  socket.on(SOCKET_EVENTS.LIST_CREATED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.LIST_CREATED, data);
  });

  socket.on(SOCKET_EVENTS.LIST_UPDATED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.LIST_UPDATED, data);
  });

  socket.on(SOCKET_EVENTS.LIST_DELETED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.LIST_DELETED, data);
  });
};