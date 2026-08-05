import Board from '../models/Board.js';
import List from '../models/List.js';
import Workspace from '../models/Workspace.js';
import { AppError } from '../utils/errorHandler.js';

// @desc    Create board
export const createBoard = async (req, res, next) => {
  try {
    const { title, description, workspaceId, background } = req.body;

    // Check workspace exists and user is member
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    const isMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      throw new AppError('Not a member of this workspace', 403);
    }

    const board = await Board.create({
      title,
      description,
      workspace: workspaceId,
      createdBy: req.user._id,
      background,
    });

    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      board,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get boards by workspace
// @route   GET /api/workspaces/:workspaceId/boards
export const getBoardsByWorkspace = async (req, res, next) => {
  try {
    const boards = await Board.find({
      workspace: req.params.workspaceId,
      isArchived: false,
    })
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get board by ID with lists and cards
// @route   GET /api/boards/:id
export const getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('createdBy', 'name avatar');

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Get lists with cards
    const lists = await List.find({ board: board._id, isArchived: false })
      .populate({
        path: 'cards',
        populate: [
          { path: 'assignees', select: 'name avatar' },
          { path: 'createdBy', select: 'name avatar' },
        ],
      })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      board,
      lists,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
export const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const { title, description, background } = req.body;
    board.title = title || board.title;
    board.description = description ?? board.description;
    board.background = background || board.background;
    await board.save();

    res.status(200).json({
      success: true,
      message: 'Board updated successfully',
      board,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
export const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    await List.deleteMany({ board: board._id });
    await Board.findByIdAndDelete(board._id);

    res.status(200).json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};