export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Private routes
  DASHBOARD: '/dashboard',
  WORKSPACES: '/workspaces',
  WORKSPACE_SETTINGS: '/workspaces/:id/settings',
  INVITE_MEMBERS: '/workspaces/:id/invite',

  // Board routes
  BOARD: '/board/:id',
  BOARD_SETTINGS: '/board/:id/settings',
  BOARD_DETAILS: '/board/:id/details',

  // Profile routes
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Other routes
  SEARCH: '/search',
  NOTIFICATIONS: '/notifications',

  // Error routes
  NOT_FOUND: '*',
  SERVER_ERROR: '/error',
};

export default ROUTES;