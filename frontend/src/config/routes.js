export const ROUTES = {
<<<<<<< HEAD
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
=======
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Workspace
  WORKSPACES: "/workspaces",
  WORKSPACE: "/workspace/:id",
  WORKSPACE_DETAIL: (id) => `/workspace/${id}`,

  // Board
  BOARDS: "/boards",
  BOARD: "/board/:id",
  BOARD_DETAIL: (id) => `/board/${id}`,

  // Tasks
  MY_TASKS: "/my-tasks",

  // Search
  SEARCH: "/search",

  // Members
  MEMBERS: "/members",

  // Notifications
  NOTIFICATIONS: "/notifications",

  // Settings
  SETTINGS: "/settings",

  // Profile
  PROFILE: "/profile",
};
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
