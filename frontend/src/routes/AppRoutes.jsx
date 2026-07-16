import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/protected/ProtectedRoute";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Protected Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Workspaces from "../pages/Workspace/WorkspaceList";
import Boards from "../pages/Board/BoardDetails";
import MyTasks from "../pages/MyTasks/MyTasks";
import Members from "../pages/Members/Members";
import Search from "../pages/Search/SearchResults";
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root */}
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path={ROUTES.DASHBOARD}
              element={<Dashboard />}
            />
            <Route
              path={ROUTES.WORKSPACES}
              element={<Workspaces />}
            />
            <Route
              path={ROUTES.BOARDS}
              element={<Boards />}
            />
            <Route
              path={ROUTES.MY_TASKS}
              element={<MyTasks />}
            />
            <Route
              path={ROUTES.MEMBERS}
              element={<Members />}
            />
            <Route
              path={ROUTES.SEARCH}
              element={<Search />}
            />
            <Route
              path={ROUTES.NOTIFICATIONS}
              element={<Notifications />}
            />
            <Route
              path={ROUTES.SETTINGS}
              element={<Settings />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;