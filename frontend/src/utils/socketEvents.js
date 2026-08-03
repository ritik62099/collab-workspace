export const SOCKET_EVENTS = {
  // Client to Server
  JOIN_BOARD: 'join-board',
  LEAVE_BOARD: 'leave-board',
  CARD_MOVED: 'card-moved',
  CARD_UPDATED: 'card-updated',
  CARD_CREATED: 'card-created',
  CARD_DELETED: 'card-deleted',
  LIST_CREATED: 'list-created',
  LIST_UPDATED: 'list-updated',
  LIST_DELETED: 'list-deleted',
  COMMENT_ADDED: 'comment-added',
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',

  // Server to Client
  BOARD_UPDATED: 'board-updated',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  USER_TYPING: 'user-typing',
  NOTIFICATION: 'notification',
};

export default SOCKET_EVENTS;