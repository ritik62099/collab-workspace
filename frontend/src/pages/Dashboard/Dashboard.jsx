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
    </div>
  );
};

export default Dashboard;