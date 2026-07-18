export const ROUTES = {
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