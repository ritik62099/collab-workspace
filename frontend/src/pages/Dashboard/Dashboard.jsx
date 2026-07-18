<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { workspaces, loading, fetchWorkspaces, createWorkspace } = useWorkspaceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    
    try {
      await createWorkspace({ name: newWorkspaceName, description: 'My new workspace' });
      setNewWorkspaceName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  if (loading && workspaces.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Workspaces</h1>
        <Button onClick={() => setIsCreating(true)}>+ New Workspace</Button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>
          <form onSubmit={handleCreate} className="flex gap-4">
            <Input
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace Name"
              className="flex-1"
            />
            <Button type="submit">Create</Button>
            <Button variant="secondary" onClick={() => setIsCreating(false)}>Cancel</Button>
          </form>
        </div>
      )}

      {workspaces.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No workspaces yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <Link 
              key={ws._id} 
              to={`/workspace/${ws._id}`} // We will create this route later, for now it's a placeholder
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {ws.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 truncate">{ws.name}</h3>
              </div>
              <p className="text-gray-500 text-sm line-clamp-2">{ws.description || 'No description provided.'}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <span>{ws.members?.length || 1} members</span>
                <span>Open Board →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
=======
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
      <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Namaste, {user?.name || 'User'}! 🙏
            </h2>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>
          <div className="px-6 py-3 text-white shadow-md bg-gradient-to-br from-orange-500 to-green-600 rounded-xl">
            <p className="text-sm font-medium">Active User</p>
            <p className="text-xs opacity-90">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div 
          className="p-6 text-white transition-shadow shadow-lg cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl hover:shadow-xl"
          onClick={() => navigate(ROUTES.WORKSPACES)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Workspaces</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{workspaces?.length || 0}</p>
          <p className="mt-1 text-sm opacity-90">View all workspaces →</p>
        </div>

        <div className="p-6 text-white shadow-lg bg-gradient-to-br from-green-600 to-green-700 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Boards</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="mt-1 text-sm opacity-90">Across all workspaces</p>
        </div>

        <div className="p-6 text-white shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="mt-1 text-sm opacity-90">Kanban coming soon</p>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">
        <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => navigate(ROUTES.WORKSPACES)}>
            <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workspace
          </Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.WORKSPACES)}>
            View All Workspaces
          </Button>
        </div>
      </div> */}

      {/* Status Message */}
      {/* <div className="p-6 border-l-4 border-orange-500 rounded-lg bg-gradient-to-r from-orange-100 to-green-100">
        <div className="flex items-start">
          <svg className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
        </div>
      </div> */}
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    </div>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
