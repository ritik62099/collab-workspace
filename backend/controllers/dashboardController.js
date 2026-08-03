import Workspace from '../models/Workspace.js';
import Board from '../models/Board.js';
import Card from '../models/Card.js';
import Notification from '../models/Notification.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get User's Workspaces
    const workspaces = await Workspace.find({ 'members.user': userId });
    const totalWorkspaces = workspaces.length;
    const workspaceIds = workspaces.map(w => w._id);
    
    // Unique members across all workspaces
    const allMembers = workspaces.flatMap(w => w.members.map(m => m.user.toString()));
    const uniqueMembers = new Set(allMembers).size;

    // 2. Active Boards Count
    const activeBoards = await Board.countDocuments({ 
      workspace: { $in: workspaceIds }, 
      isArchived: false 
    });

    // 3. My Tasks (Cards assigned to user)
    const myCards = await Card.find({ 
      assignees: userId, 
      isArchived: false 
    })
    .populate('list', 'title')
    .populate('board', 'title')
    .sort({ dueDate: 1 }); // Sort by due date

    const myTasksCount = myCards.length;

    // 4. Task Status Distribution (Based on List Title)
    const statusMap = { 'To Do': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 };
    myCards.forEach(card => {
      const listTitle = card.list?.title?.toLowerCase() || '';
      if (listTitle.includes('to do') || listTitle.includes('backlog')) statusMap['To Do']++;
      else if (listTitle.includes('progress')) statusMap['In Progress']++;
      else if (listTitle.includes('review') || listTitle.includes('qa')) statusMap['Review']++;
      else if (listTitle.includes('done') || listTitle.includes('complete')) statusMap['Done']++;
    });

    const colors = { 'To Do': '#F59E0B', 'In Progress': '#3B82F6', 'Review': '#8B5CF6', 'Done': '#22C55E' };
    const taskStatusData = Object.entries(statusMap)
      .map(([name, value]) => ({ name, value, color: colors[name] || '#6B7280' }));

    // 5. Upcoming Deadlines (Next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingDeadlines = myCards
      .filter(card => card.dueDate && new Date(card.dueDate) >= today && new Date(card.dueDate) <= nextWeek)
      .slice(0, 5) // Top 5
      .map(card => ({
        id: card._id,
        title: card.title,
        workspace: card.board?.title || 'Unknown Workspace',
        due: card.dueDate,
        priority: 'Medium' // Default priority
      }));

    // 6. Recent Activity (From Notifications)
    const recentNotifications = await Notification.find({ recipient: userId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = recentNotifications.map(n => ({
      id: n._id,
      user: n.sender?.name || 'System',
      action: n.type === 'workspace_invite' ? 'invited you to' : (n.type === 'card_assigned' ? 'assigned you to' : 'updated'),
      target: n.message.split('"')[1] || 'a task',
      time: n.createdAt
    }));

    // 7. Workspace Overview Data
    const workspaceOverview = await Promise.all(
      workspaces.slice(0, 3).map(async (w) => {
        const boardCount = await Board.countDocuments({ workspace: w._id, isArchived: false });
        const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
        return {
          id: w._id,
          name: w.name,
          members: w.members.length,
          boards: boardCount,
          tasks: myCards.filter(c => workspaceIds.includes(c.board)).length, // Approximate
          progress: Math.floor(Math.random() * 40) + 60, // Placeholder until we calculate real progress
          color: colors[workspaces.indexOf(w) % colors.length]
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: { totalWorkspaces, activeBoards, myTasks: myTasksCount, members: uniqueMembers },
      taskStatus: taskStatusData,
      upcomingDeadlines,
      recentActivity,
      workspaces: workspaceOverview
    });

  } catch (error) {
    next(error);
  }
};