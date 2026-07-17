export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected Routes
  DASHBOARD: '/dashboard',
  WORKSPACES: '/workspaces',
  WORKSPACE: '/workspace/:id',
  WORKSPACE_DETAIL: (id) => `/workspace/${id}`,
  BOARD: '/board/:id',
  BOARD_DETAIL: (id) => `/board/${id}`,
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  SEARCH: '/search',
};
