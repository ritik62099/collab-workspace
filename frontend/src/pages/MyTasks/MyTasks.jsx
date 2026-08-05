import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import { formatters } from '../../utils/formatters';
import Loader from '../../components/common/Loader';


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
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.workspace?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.board?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Status ke liye modern colors aur dot indicator
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('done') || s.includes('complete')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('progress')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('review')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (s.includes('todo') || s.includes('to do')) return 'bg-slate-50 text-slate-700 border-slate-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusDot = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('done') || s.includes('complete')) return 'bg-emerald-500';
    if (s.includes('progress')) return 'bg-blue-500';
    if (s.includes('review')) return 'bg-purple-500';
    if (s.includes('todo') || s.includes('to do')) return 'bg-slate-500';
    return 'bg-gray-500';
  };

  // Due date ke liye colors aur background highlight (Overdue / Due Soon)
  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return 'text-gray-400';
    const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'text-red-600 bg-red-50 px-2 py-1 rounded-md font-semibold border border-red-100'; // Overdue
    if (daysLeft <= 2) return 'text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-semibold border border-amber-100'; // Due soon
    return 'text-gray-600';
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Track and manage all tasks assigned to you across workspaces.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTasks}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all shadow-sm"
            title="Refresh Tasks"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="text-sm bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2">
            <span className="text-gray-500 font-medium">Total:</span> 
            <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{filteredTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tasks, workspaces, or boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-0 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-gray-50 text-gray-700 placeholder-gray-400 transition-all outline-none"
          />
        </div>
        <div className="relative min-w-[160px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-700 font-medium transition-all cursor-pointer hover:bg-gray-50"
          >
            <option value="All">All Lists</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            {tasks.length === 0 
              ? "You're all caught up! You don't have any tasks assigned to you yet." 
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-semibold text-gray-500 uppercase bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 tracking-wider">Task Name</th>
                  <th className="px-6 py-4 tracking-wider">Workspace / Board</th>
                  <th className="px-6 py-4 tracking-wider">Status</th>
                  <th className="px-6 py-4 tracking-wider">Due Date</th>
                  <th className="px-6 py-4 tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-orange-50/40 transition-colors duration-200 group">
                    {/* Task Name & Labels */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 mb-1.5 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {task.title}
                      </div>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {task.labels.map((label, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold shadow-sm"
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100 shrink-0">
                          {task.workspace?.charAt(0).toUpperCase() || 'W'}
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium leading-tight">{task.workspace}</div>
                          <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {task.board}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(task.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(task.status)}`}></span>
                        {task.status}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4">
                      {task.dueDate ? (
                        <div className={`inline-flex items-center gap-1.5 text-xs ${getDueDateStyle(task.dueDate)}`}>
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatters.formatDate(task.dueDate, { month: 'short', day: 'numeric' })}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          No Date
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/board/${task.boardId}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200 shadow-sm"
                      >
                        Open Board
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
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