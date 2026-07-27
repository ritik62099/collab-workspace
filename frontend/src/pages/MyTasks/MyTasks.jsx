import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import { formatters } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await cardService.getMyTasks();
      setTasks(res.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search aur Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.workspace.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.board.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Status ke liye colors
  const getStatusStyle = (status) => {
    const s = status.toLowerCase();
    if (s.includes('done') || s.includes('complete')) return 'bg-green-100 text-green-700 border-green-200';
    if (s.includes('progress')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s.includes('review')) return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Due date ke liye colors
  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'text-red-600 font-semibold'; // Overdue
    if (daysLeft <= 2) return 'text-orange-600 font-semibold'; // Due soon
    return 'text-gray-600';
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 mt-1">All tasks assigned to you across all workspaces.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
             Total: <span className="font-bold text-gray-900">{filteredTasks.length}</span>
           </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks, workspaces, or boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-700"
        >
          <option value="All">All Lists</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {tasks.length === 0 ? "You don't have any tasks assigned to you yet." : "No tasks match your filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Task Name</th>
                  <th className="px-6 py-4 font-semibold">Workspace / Board</th>
                  <th className="px-6 py-4 font-semibold">List (Status)</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50 transition-colors group">
                    {/* Task Name & Labels */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                        {task.title}
                      </div>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.labels.map((label, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Workspace & Board */}
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{task.workspace}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{task.board}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyle(task.status)}`}>
                        {task.status}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className={`px-6 py-4 ${getDueDateStyle(task.dueDate)}`}>
                      {task.dueDate ? formatters.formatDate(task.dueDate, { month: 'short', day: 'numeric' }) : 'No Date'}
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/board/${task.boardId}`)}
                      >
                        Open Board
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;