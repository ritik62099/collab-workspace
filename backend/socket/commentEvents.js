import { SOCKET_EVENTS } from '../utils/constants.js';

export const registerCommentEvents = (io, socket) => {
  socket.on(SOCKET_EVENTS.COMMENT_ADDED, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.COMMENT_ADDED, {
      ...data,
      user: {
        _id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
    });
  });

  // Typing indicators
  socket.on(SOCKET_EVENTS.TYPING_START, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.USER_TYPING, {
      cardId: data.cardId,
      userId: socket.user._id,
      userName: socket.user.name,
      isTyping: true,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
    socket.to(`board-${data.boardId}`).emit(SOCKET_EVENTS.USER_TYPING, {
      cardId: data.cardId,
      userId: socket.user._id,
      isTyping: false,
    });
  });
};