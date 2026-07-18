import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../config/routes';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
