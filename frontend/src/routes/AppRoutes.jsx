import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/protected/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";

// Auth Pages
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));

// Dashboard
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));

// Workspace
const WorkspaceList = lazy(() =>
  import("../pages/Workspace/WorkspaceList")
);
const WorkspaceDetail = lazy(() =>
  import("../pages/Workspace/WorkspaceDetail")
);

// Board
const BoardView = lazy(() => import("../pages/Board/BoardView"));

// Tasks
const MyTasks = lazy(() => import("../pages/MyTasks/MyTasks"));

// Search
const SearchResults = lazy(() =>
  import("../pages/Search/SearchResults")
);

// Notifications
const Notifications = lazy(() =>
  import("../pages/Notifications/Notifications")
);

// Members
const Members = lazy(() => import("../pages/Members/Members"));

// Profile
const Profile = lazy(() => import("../pages/Profile/Profile"));

// Settings
const Settings = lazy(() => import("../pages/Settings/Settings"));

// Error
const NotFound = lazy(() => import("../pages/Error/NotFound"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Workspace */}
            <Route path="workspaces" element={<WorkspaceList />} />
            <Route path="workspace/:id" element={<WorkspaceDetail />} />

            {/* Board */}
            <Route path="board/:id" element={<BoardView />} />

            {/* Tasks */}
            <Route path="my-tasks" element={<MyTasks />} />

            {/* Search */}
            <Route path="search" element={<SearchResults />} />

            {/* Notifications */}
            <Route
              path="notifications"
              element={<Notifications />}
            />

            {/* Members */}
            <Route path="members" element={<Members />} />

            {/* Profile */}
            <Route path="profile" element={<Profile />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;