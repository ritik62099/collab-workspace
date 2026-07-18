import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWorkspaceStore from '../../store/useWorkspaceStore';
import useBoardStore from '../../store/useBoardStore';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';
import BoardCard from '../Board/BoardCard';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace, isLoading: workspaceLoading, fetchWorkspaceById, updateWorkspace, deleteWorkspace } = useWorkspaceStore();
  const { boards, isLoading: boardsLoading, fetchBoardsByWorkspace, createBoard, deleteBoard } = useBoardStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [boardFormData, setBoardFormData] = useState({ title: '', description: '', background: '#FF9933' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(id);
      fetchBoardsByWorkspace(id);
    }
  }, [id, fetchWorkspaceById, fetchBoardsByWorkspace]);

  useEffect(() => {
    if (currentWorkspace) {
      setEditFormData({
        name: currentWorkspace.name,
        description: currentWorkspace.description || '',
      });
    }
  }, [currentWorkspace]);

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!editFormData.name.trim()) {
      errors.name = 'Workspace name is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateWorkspace(id, editFormData);
      setShowEditModal(false);
      setFormErrors({});
    } catch (error) {
      console.error('Update workspace error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!window.confirm('Are you sure you want to delete this workspace? All boards will be deleted.')) return;
    try {
      await deleteWorkspace(id);
      navigate('/workspaces');
    } catch (error) {
      console.error('Delete workspace error:', error);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!boardFormData.title.trim()) {
      errors.title = 'Board title is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createBoard({ ...boardFormData, workspaceId: id });
      setShowCreateBoardModal(false);
      setBoardFormData({ title: '', description: '', background: '#FF9933' });
      setFormErrors({});
    } catch (error) {
      console.error('Create board error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteBoard(boardId);
    } catch (error) {
      console.error('Delete board error:', error);
    }
  };

  const copyInviteCode = () => {
    if (currentWorkspace?.inviteCode) {
      navigator.clipboard.writeText(currentWorkspace.inviteCode);
      alert('Invite code copied to clipboard!');
    }
  };

  if (workspaceLoading && !currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading workspace..." />
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Workspace Not Found</h3>
        <p className="text-gray-600 mb-6">The workspace you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/workspaces')}>
          Back to Workspaces
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <button
                onClick={() => navigate('/workspaces')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{currentWorkspace.name}</h1>
            </div>
            <p className="text-gray-600 ml-14">{currentWorkspace.description || 'No description'}</p>
          </div>

          <Dropdown
            align="right"
            trigger={
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            }
          >
            <DropdownItem
              onClick={() => setShowEditModal(true)}
              icon={({ className }) => (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
            >
              Edit Workspace
            </DropdownItem>
            <DropdownItem
              onClick={copyInviteCode}
              icon={({ className }) => (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            >
              Copy Invite Code
            </DropdownItem>
            <DropdownItem
              onClick={handleDeleteWorkspace}
              danger
              icon={({ className }) => (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            >
              Delete Workspace
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Members */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-semibold text-gray-700">Members</h3>
              <div className="flex -space-x-2">
                {currentWorkspace.members?.slice(0, 5).map((member) => (
                  <Avatar
                    key={member.user._id}
                    src={member.user.avatar}
                    alt={member.user.name}
                    size="sm"
                    className="ring-2 ring-white"
                  />
                ))}
                {currentWorkspace.members?.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                    +{currentWorkspace.members.length - 5}
                  </div>
                )}
              </div>
            </div>
            {currentWorkspace.inviteCode && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Invite Code:</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-orange-600">
                  {currentWorkspace.inviteCode}
                </code>
                <button
                  onClick={copyInviteCode}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boards Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Boards</h2>
          <Button variant="primary" onClick={() => setShowCreateBoardModal(true)}>
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Board
          </Button>
        </div>

        {boardsLoading && boards.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <Loader size="md" message="Loading boards..." />
          </div>
        ) : boards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Boards Yet</h3>
            <p className="text-gray-600 mb-6">Create your first board to start organizing tasks.</p>
            <Button variant="primary" onClick={() => setShowCreateBoardModal(true)}>
              Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Workspace Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setFormErrors({});
        }}
        title="Edit Workspace"
        size="md"
      >
        <form onSubmit={handleUpdateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            name="name"
            value={editFormData.name}
            onChange={(e) => {
              setEditFormData({ ...editFormData, name: e.target.value });
              if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
            }}
            error={formErrors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditModal(false);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Board Modal */}
      <Modal
        isOpen={showCreateBoardModal}
        onClose={() => {
          setShowCreateBoardModal(false);
          setBoardFormData({ title: '', description: '', background: '#FF9933' });
          setFormErrors({});
        }}
        title="Create New Board"
        size="md"
      >
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <Input
            label="Board Title"
            name="title"
            value={boardFormData.title}
            onChange={(e) => {
              setBoardFormData({ ...boardFormData, title: e.target.value });
              if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
            }}
            error={formErrors.title}
            placeholder="e.g., Marketing Campaign"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={boardFormData.description}
              onChange={(e) => setBoardFormData({ ...boardFormData, description: e.target.value })}
              placeholder="What's this board about?"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex space-x-2">
              {['#FF9933', '#138808', '#1E40AF', '#7C3AED', '#DC2626', '#059669'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBoardFormData({ ...boardFormData, background: color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    boardFormData.background === color ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateBoardModal(false);
                setBoardFormData({ title: '', description: '', background: '#FF9933' });
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Board
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkspaceDetail;
