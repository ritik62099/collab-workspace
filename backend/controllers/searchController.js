import Card from '../models/Card.js';
import Board from '../models/Board.js';
import Workspace from '../models/Workspace.js';

// @desc    Global search
// @route   GET /api/search?q=keyword
export const globalSearch = async (req, res, next) => {
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

    // Search in parallel
    const [cards, boards] = await Promise.all([
      Card.find({
        board: { $in: workspaceIds },
        $or: [{ title: regex }, { description: regex }],
        isArchived: false,
      })
        .populate('board', 'title')
        .limit(20),
      Board.find({
        workspace: { $in: workspaceIds },
        title: regex,
        isArchived: false,
      }).limit(20),
    ]);

    res.status(200).json({
      success: true,
      results: { cards, boards },
      total: cards.length + boards.length,
    });
  } catch (error) {
    next(error);
  }
};