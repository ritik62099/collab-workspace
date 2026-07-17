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
import WorkspaceList from "../pages/Workspace/WorkspaceList";
import WorkspaceDetail from "../pages/Workspace/WorkspaceDetail";
import BoardView from "../pages/Board/BoardView";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root */}
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
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
              element={<WorkspaceList />}
            />
            <Route
              path={ROUTES.WORKSPACE}
              element={<WorkspaceDetail />}
            />
          </Route>
          {/* Board View without MainLayout (full screen) */}
          <Route path={ROUTES.BOARD} element={<BoardView />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;