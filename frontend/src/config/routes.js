export const ROUTES = {
  // =========================
  // Public Routes
  // =========================
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // =========================
  // Dashboard
  // =========================
  DASHBOARD: "/dashboard",

  // =========================
  // Workspace
  // =========================
  WORKSPACES: "/workspaces",
  WORKSPACE: "/workspaces/:id",
  WORKSPACE_DETAILS: (id) => `/workspaces/${id}`,
  WORKSPACE_SETTINGS: "/workspaces/:id/settings",
  INVITE_MEMBERS: "/workspaces/:id/invite",

  // =========================
  // Board
  // =========================
  BOARD: "/board/:id",
  BOARD_DETAILS: (id) => `/board/${id}`,
  BOARD_SETTINGS: "/board/:id/settings",

  // =========================
  // Tasks
  // =========================
  MY_TASKS: "/my-tasks",

  // =========================
  // Members
  // =========================
  MEMBERS: "/members",

  // =========================
  // Search
  // =========================
  SEARCH: "/search",

  // =========================
  // Notifications
  // =========================
  NOTIFICATIONS: "/notifications",

  // =========================
  // Profile
  // =========================
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // =========================
  // Error
  // =========================
  SERVER_ERROR: "/error",
  NOT_FOUND: "*",
};

export default ROUTES;