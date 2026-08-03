import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { workspaceService } from '../../services/workspaceService'; // ✅ Import added
import { boardService } from '../../services/boardService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { currentWorkspace, loading: workspaceLoading, fetchWorkspaceById, updateWorkspace, deleteWorkspace } = useWorkspaceStore();

  const [boards, setBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(true);
  
  // Modals State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false); // ✅ New State
  
  // Form Data
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [boardFormData, setBoardFormData] = useState({ title: '', description: '', background: '#FF9933' });
  const [inviteEmail, setInviteEmail] = useState(''); // ✅ New State
  const [inviteMessage, setInviteMessage] = useState({ type: '', text: '' }); // ✅ Success/Error message
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(id);
      fetchBoards();
    }
  }, [id]);

  const fetchBoards = async () => {
    setBoardsLoading(true);
    try {
      const res = await boardService.getByWorkspace(id);
      setBoards(res.boards || []);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    } finally {
      setBoardsLoading(false);
    }
  };

  useEffect(() => {
    if (currentWorkspace) {
      setEditFormData({
        name: currentWorkspace.name,
        description: currentWorkspace.description || '',
      });
    }
  }, [currentWorkspace]);

  // ✅ NEW: Handle Invite Member
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsSubmitting(true);
    setInviteMessage({ type: '', text: '' });

    try {
      await workspaceService.inviteMember(id, { email: inviteEmail });
      setInviteMessage({ type: 'success', text: 'Invite sent successfully!' });
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setInviteMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send invite. Check if user exists.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editFormData.name.trim()) errors.name = 'Workspace name is required';

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
    if (!boardFormData.title.trim()) errors.title = 'Board title is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await boardService.create({ ...boardFormData, workspaceId: id });
      setBoards([res.board, ...boards]);
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
      await boardService.delete(boardId);
      setBoards(boards.filter(b => b._id !== boardId));
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
    return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>;
  }

  if (!currentWorkspace) {
    return (
      <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
        <h3 className="mb-2 text-xl font-bold text-gray-900">Workspace Not Found</h3>
        <Button variant="primary" onClick={() => navigate('/workspaces')}>Back to Workspaces</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="p-6 mb-8 bg-white shadow-lg rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3 space-x-3">
              <button onClick={() => navigate('/workspaces')} className="p-2 transition-colors rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{currentWorkspace.name}</h1>
            </div>
            <p className="text-gray-600 ml-14">{currentWorkspace.description || 'No description'}</p>
          </div>

          <div className="flex space-x-2">
            {/* ✅ NEW: Invite Members Button */}
            <Button variant="outline" onClick={() => setShowInviteModal(true)}>
              <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Invite Members
            </Button>

            <Dropdown align="right" trigger={
              <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </button>
            }>
              <DropdownItem onClick={() => setShowEditModal(true)}>Edit Workspace</DropdownItem>
              <DropdownItem onClick={copyInviteCode}>Copy Invite Code</DropdownItem>
              <DropdownItem onClick={handleDeleteWorkspace} danger>Delete Workspace</DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Members List */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-semibold text-gray-700">Members ({currentWorkspace.members?.length || 0})</h3>
              <div className="flex -space-x-2">
                {currentWorkspace.members?.slice(0, 5).map((member, idx) => (
                  <Avatar key={member.user?._id || idx} src={member.user?.avatar} alt={member.user?.name || 'Member'} size="sm" className="ring-2 ring-white" />
                ))}
                {currentWorkspace.members?.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-600 bg-gray-200 rounded-full ring-2 ring-white">+{currentWorkspace.members.length - 5}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boards Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Boards</h2>
          <Button variant="primary" onClick={() => setShowCreateBoardModal(true)}>
            <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Board
          </Button>
        </div>

        {boardsLoading && boards.length === 0 ? (
          <div className="flex items-center justify-center h-64"><Loader size="md" /></div>
        ) : boards.length === 0 ? (
          <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
            <h3 className="mb-2 text-xl font-bold text-gray-900">No Boards Yet</h3>
            <Button variant="primary" onClick={() => setShowCreateBoardModal(true)}>Create Board</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => (
              <div key={board._id} onClick={() => navigate(`/board/${board._id}`)} className="group relative h-40 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" style={{ backgroundColor: board.background || '#0079BF' }}>
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all" />
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{board.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm opacity-80 group-hover:opacity-100 transition-opacity">Open Board →</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board._id); }} className="text-white opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity p-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ NEW: Invite Members Modal */}
      <Modal isOpen={showInviteModal} onClose={() => { setShowInviteModal(false); setInviteMessage({ type: '', text: '' }); }} title="Invite Members" size="md">
        <form onSubmit={handleInviteMember} className="space-y-4">
          <p className="text-sm text-gray-600">Enter the email address of the user you want to invite. They must have an account on this platform.</p>
          
          <Input
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
          />

          {inviteMessage.text && (
            <div className={`p-3 rounded-lg text-sm ${inviteMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {inviteMessage.text}
            </div>
          )}

          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Workspace" size="md">
        <form onSubmit={handleUpdateWorkspace} className="space-y-4">
          <Input label="Workspace Name" name="name" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} error={formErrors.name} required />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} rows={3} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>

      {/* Create Board Modal */}
      <Modal isOpen={showCreateBoardModal} onClose={() => setShowCreateBoardModal(false)} title="Create New Board" size="md">
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <Input label="Board Title" name="title" value={boardFormData.title} onChange={(e) => setBoardFormData({ ...boardFormData, title: e.target.value })} error={formErrors.title} placeholder="e.g., Marketing Campaign" required />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={boardFormData.description} onChange={(e) => setBoardFormData({ ...boardFormData, description: e.target.value })} placeholder="What's this board about?" rows={3} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Background Color</label>
            <div className="flex space-x-2">
              {['#FF9933', '#138808', '#1E40AF', '#7C3AED', '#DC2626', '#059669'].map((color) => (
                <button key={color} type="button" onClick={() => setBoardFormData({ ...boardFormData, background: color })} className={`w-10 h-10 rounded-lg transition-all ${boardFormData.background === color ? 'ring-4 ring-offset-2 ring-gray-400' : ''}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="ghost" onClick={() => setShowCreateBoardModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Board'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkspaceDetail;