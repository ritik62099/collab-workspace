<<<<<<< HEAD
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/protected/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/common/Loader';

// Lazy load pages for better performance
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const BoardView = lazy(() => import('../pages/Board/BoardView'));
const NotFound = lazy(() => import('../pages/Error/NotFound'));
=======
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
import MyTask from "../pages/MyTasks/MyTasks";

import Search from "../pages/Search/SearchResults";
import Notifications from "../pages/Notifications/Notifications";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Members from "../pages/Members/Members";
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c

const AppRoutes = () => {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Layout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="board/:id" element={<BoardView />} />
            {/* Add more routes here as we build them */}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
=======
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
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.WORKSPACES} element={<WorkspaceList />} />
            <Route path={ROUTES.WORKSPACE} element={<WorkspaceDetail />} />
            <Route path={ROUTES.BOARDS} element={<BoardView />} />
            <Route path={ROUTES.MY_TASKS} element={<MyTask />} />
            <Route path={ROUTES.SEARCH} element={<Search />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.MEMBERS} element={<Members />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>
          {/* Board View without MainLayout (full screen) */}
          <Route path={ROUTES.BOARD} element={<BoardView />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    </BrowserRouter>
  );
};

<<<<<<< HEAD
export default AppRoutes;
=======
export default AppRoutes;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
