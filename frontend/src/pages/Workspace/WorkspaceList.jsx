import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkspaceStore from '../../store/useWorkspaceStore';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';
import { ROUTES } from '../../config/routes';

const WorkspaceList = () => {
  const navigate = useNavigate();
  const { workspaces, isLoading, error, fetchWorkspaces, createWorkspace, deleteWorkspace, joinWorkspace, clearError } = useWorkspaceStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [joinCode, setJoinCode] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Workspace name is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const workspace = await createWorkspace(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      setFormErrors({});
      navigate(`/workspace/${workspace._id}`);
    } catch (error) {
      console.error('Create workspace error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsSubmitting(true);
    try {
      const workspace = await joinWorkspace(joinCode);
      setShowJoinModal(false);
      setJoinCode('');
      navigate(`/workspace/${workspace._id}`);
    } catch (error) {
      console.error('Join workspace error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workspace?')) return;
    try {
      await deleteWorkspace(id);
    } catch (error) {
      console.error('Delete workspace error:', error);
    }
  };

  if (isLoading && workspaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading workspaces..." />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-600 mt-1">Manage your collaborative workspaces</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Join Workspace
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workspace
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Workspaces Grid */}
      {workspaces.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Workspaces Yet</h3>
          <p className="text-gray-600 mb-6">Create your first workspace or join an existing one to get started.</p>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              Join Workspace
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Workspace
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/workspace/${workspace._id}`)}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{workspace.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{workspace.description || 'No description'}</p>
                  </div>
                  <Dropdown
                    align="right"
                    trigger={
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    }
                  >
                    <DropdownItem
                      onClick={() => navigate(`/workspace/${workspace._id}`)}
                      icon={({ className }) => (
                        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    >
                      View
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleDeleteWorkspace(workspace._id)}
                      danger
                      icon={({ className }) => (
                        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    >
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar src={workspace.owner?.avatar} alt={workspace.owner?.name} size="sm" />
                      <span className="text-xs text-gray-600">{workspace.owner?.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {workspace.members?.length || 0} members
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setFormData({ name: '', description: '' });
          setFormErrors({});
        }}
        title="Create New Workspace"
        size="md"
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
            }}
            error={formErrors.name}
            placeholder="e.g., Marketing Team"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's this workspace about?"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                setFormData({ name: '', description: '' });
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>

      {/* Join Workspace Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setJoinCode('');
        }}
        title="Join Workspace"
        size="md"
      >
        <form onSubmit={handleJoinWorkspace} className="space-y-4">
          <Input
            label="Invite Code"
            name="code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter workspace invite code"
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                Ask the workspace owner for an invite code to join their workspace.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowJoinModal(false);
                setJoinCode('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Join Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkspaceList;
