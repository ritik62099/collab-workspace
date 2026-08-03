import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { boardService } from '../../services/boardService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

const WorkspaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentWorkspace, fetchWorkspaceById } = useWorkspaceStore();
  
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await fetchWorkspaceById(id);
      try {
        const res = await boardService.getByWorkspace(id);
        setBoards(res.boards || []);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const res = await boardService.create({
        title: newBoardTitle,
        workspaceId: id,
        background: '#0079BF'
      });
      setBoards([res.board, ...boards]);
      setNewBoardTitle('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!currentWorkspace) return <div className="p-10 text-center">Workspace not found.</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-primary-600 mb-1 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{currentWorkspace.name}</h1>
          <p className="text-gray-500">{currentWorkspace.description || 'No description'}</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>+ New Board</Button>
      </div>

      {/* Create Board Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200 animate-scale-in">
          <h3 className="text-lg font-semibold mb-4">Create New Board</h3>
          <form onSubmit={handleCreateBoard} className="flex gap-4">
            <Input
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Board Title (e.g., Sprint 1)"
              className="flex-1"
              autoFocus
            />
            <Button type="submit">Create</Button>
            <Button variant="secondary" onClick={() => setIsCreating(false)}>Cancel</Button>
          </form>
        </div>
      )}

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-4">No boards in this workspace yet.</p>
          <Button onClick={() => setIsCreating(true)}>Create your first board</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board._id}
              to={`/board/${board._id}`}
              className="group relative h-40 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{ backgroundColor: board.background || '#0079BF' }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all" />
              <div className="relative p-6 h-full flex flex-col justify-between">
                <h3 className="text-xl font-bold text-white drop-shadow-md">{board.title}</h3>
                <span className="text-white text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                  Open Board →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceView;