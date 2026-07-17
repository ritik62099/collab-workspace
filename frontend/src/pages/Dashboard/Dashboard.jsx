import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useWorkspaceStore from '../../store/useWorkspaceStore';
import Button from '../../components/common/Button';
import { ROUTES } from '../../config/routes';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Namaste, {user?.name || 'User'}! 🙏
            </h2>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-md">
            <p className="text-sm font-medium">Active User</p>
            <p className="text-xs opacity-90">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => navigate(ROUTES.WORKSPACES)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Workspaces</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{workspaces?.length || 0}</p>
          <p className="text-sm opacity-90 mt-1">View all workspaces →</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Boards</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm opacity-90 mt-1">Across all workspaces</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm opacity-90 mt-1">Kanban coming soon</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => navigate(ROUTES.WORKSPACES)}>
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workspace
          </Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.WORKSPACES)}>
            View All Workspaces
          </Button>
        </div>
      </div>

      {/* Status Message */}
      <div className="bg-gradient-to-r from-orange-100 to-green-100 border-l-4 border-orange-500 rounded-lg p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
