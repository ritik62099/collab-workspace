export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
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

export const LABEL_COLORS = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  gray: '#6b7280',
};

export const BOARD_COLORS = [
  '#0079BF',
  '#5243AA',
  '#0E5A8A',
  '#EB5A46',
  '#F2D600',
  '#00C2E0',
  '#51E898',
  '#FF9F1A',
];