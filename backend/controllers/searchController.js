import Card from '../models/Card.js';
import Board from '../models/Board.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

// @desc    Global search
// @route   GET /api/search?q=keyword&filter=type
export const globalSearch = async (req, res, next) => {
  try {
    const { q, filter } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const regex = new RegExp(q, 'i');

    // Get user's workspaces
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
    }).select('_id');
    const workspaceIds = workspaces.map((w) => w._id);

    let results = { cards: [], boards: [], workspaces: [], users: [] };

    // Filter by type or search all
    if (!filter || filter === 'all' || filter === 'cards') {
      // Get boards in user's workspaces
      const boards = await Board.find({
        workspace: { $in: workspaceIds },
        isArchived: false,
      }).select('_id');
      const boardIds = boards.map((b) => b._id);

      results.cards = await Card.find({
        board: { $in: boardIds },
        $or: [{ title: regex }, { description: regex }],
        isArchived: false,
      })
        .populate('board', 'title')
        .populate('assignedTo', 'name email avatar')
        .sort({ updatedAt: -1 })
        .limit(20);
    }

    if (!filter || filter === 'all' || filter === 'boards') {
      results.boards = await Board.find({
        workspace: { $in: workspaceIds },
        $or: [{ title: regex }, { description: regex }],
        isArchived: false,
      })
        .populate('workspace', 'name')
        .sort({ updatedAt: -1 })
        .limit(20);
    }

    if (!filter || filter === 'all' || filter === 'workspaces') {
      results.workspaces = await Workspace.find({
        'members.user': req.user._id,
        $or: [{ name: regex }, { description: regex }],
      })
        .sort({ updatedAt: -1 })
        .limit(20);
    }

    if (!filter || filter === 'all' || filter === 'users') {
      // Search for users in the same workspaces
      const allMembers = await Workspace.find({
        'members.user': req.user._id,
      }).select('members.user');
      
      const userIds = [...new Set(allMembers.flatMap(w => w.members.map(m => m.user)))];
      
      results.users = await User.find({
        _id: { $in: userIds },
        $or: [{ name: regex }, { email: regex }],
      })
        .select('name email avatar role')
        .limit(20);
    }

    const total =
      (results.cards?.length || 0) +
      (results.boards?.length || 0) +
      (results.workspaces?.length || 0) +
      (results.users?.length || 0);

    res.status(200).json({
      success: true,
      results,
      total,
      query: q,
      filter: filter || 'all',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions?q=keyword
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const regex = new RegExp(q, 'i');

    // Get user's workspaces
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
    }).select('_id');
    const workspaceIds = workspaces.map((w) => w._id);

    // Get boards in user's workspaces
    const boards = await Board.find({
      workspace: { $in: workspaceIds },
      isArchived: false,
    }).select('_id');
    const boardIds = boards.map((b) => b._id);

    // Get quick suggestions
    const [cardSuggestions, boardSuggestions] = await Promise.all([
      Card.find({
        board: { $in: boardIds },
        title: regex,
        isArchived: false,
      })
        .select('title')
        .limit(5),
      Board.find({
        workspace: { $in: workspaceIds },
        title: regex,
        isArchived: false,
      })
        .select('title')
        .limit(5),
    ]);

    const suggestions = [
      ...cardSuggestions.map(c => c.title),
      ...boardSuggestions.map(b => b.title),
    ].slice(0, 10);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
};