export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const WORKSPACE_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

export const NOTIFICATION_TYPES = {
  CARD_ASSIGNED: 'card_assigned',
  CARD_MENTIONED: 'card_mentioned',
  COMMENT_ADDED: 'comment_added',
  WORKSPACE_INVITE: 'workspace_invite',
  CARD_DUE: 'card_due',
  BOARD_UPDATE: 'board_update',
};

export const SOCKET_EVENTS = {
  // Client -> Server
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

  // Server -> Client
  BOARD_UPDATED: 'board-updated',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  USER_TYPING: 'user-typing',
  NOTIFICATION: 'notification',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
};