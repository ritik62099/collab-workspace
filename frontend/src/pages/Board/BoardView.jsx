import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBoardStore from '../../store/useBoardStore';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';
import KanbanBoard from '../../components/kanban/KanbanBoard';

const BoardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentBoard, 
    currentBoardLists, 
    isLoading, 
    fetchBoardById, 
    updateBoard, 
    deleteBoard 
  } = useBoardStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', background: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (id) {
      fetchBoardById(id);
    }
  }, [id, fetchBoardById]);

  useEffect(() => {
    if (currentBoard) {
      setEditFormData({
        title: currentBoard.title,
        description: currentBoard.description || '',
        background: currentBoard.background || '#FF9933',
      });
    }
  }, [currentBoard]);

  const handleUpdateBoard = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!editFormData.title.trim()) {
      errors.title = 'Board title is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBoard(id, editFormData);
      setShowEditModal(false);
      setFormErrors({});
    } catch (error) {
      console.error('Update board error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteBoard(id);
      navigate(`/workspace/${currentBoard.workspace}`);
    } catch (error) {
      console.error('Delete board error:', error);
    }
  };

  if (isLoading && !currentBoard) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading board..." />
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Board Not Found</h3>
        <p className="text-gray-600 mb-6">The board you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/workspaces')}>
          Back to Workspaces
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentBoard.background || '#FF9933' }}>
      {/* Board Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/workspace/${currentBoard.workspace}`)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">{currentBoard.title}</h1>
            </div>

            <Dropdown
              align="right"
              trigger={
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                Edit Board
              </DropdownItem>
              <DropdownItem
                onClick={handleDeleteBoard}
                danger
                icon={({ className }) => (
                  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              >
                Delete Board
              </DropdownItem>
            </Dropdown>
          </div>

          {currentBoard.description && (
            <p className="text-white/90 mt-2 ml-14">{currentBoard.description}</p>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)]">
        <KanbanBoard boardId={id} lists={currentBoardLists} />
      </div>

      {/* Edit Board Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setFormErrors({});
        }}
        title="Edit Board"
        size="md"
      >
        <form onSubmit={handleUpdateBoard} className="space-y-4">
          <Input
            label="Board Title"
            name="title"
            value={editFormData.title}
            onChange={(e) => {
              setEditFormData({ ...editFormData, title: e.target.value });
              if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
            }}
            error={formErrors.title}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex space-x-2">
              {['#FF9933', '#138808', '#1E40AF', '#7C3AED', '#DC2626', '#059669'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setEditFormData({ ...editFormData, background: color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    editFormData.background === color ? 'ring-4 ring-offset-2 ring-gray-400' : ''
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
    </div>
  );
};

export default BoardView;
