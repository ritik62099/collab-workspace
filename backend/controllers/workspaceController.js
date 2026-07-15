import Workspace from '../models/Workspace.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { deleteCacheByPattern } from '../services/cacheService.js';

// @desc    Create workspace
// @route   POST /api/workspaces
export const createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    // Generate invite code
    workspace.generateInviteCode();
    await workspace.save();

    await deleteCacheByPattern(`workspaces:${req.user._id}:*`);

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's workspaces
// @route   GET /api/workspaces
export const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
      isArchived: false,
    })
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workspaces.length,
      workspaces,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workspace by ID
// @route   GET /api/workspaces/:id
export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar email');

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Check if user is member
    const isMember = workspace.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      throw new AppError('Not authorized to access this workspace', 403);
    }

    res.status(200).json({
      success: true,
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
export const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Check if user is admin
    if (workspace.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Only workspace owner can update', 403);
    }

    const { name, description } = req.body;
    workspace.name = name || workspace.name;
    workspace.description = description ?? workspace.description;
    await workspace.save();

    await deleteCacheByPattern(`workspaces:${req.user._id}:*`);

    res.status(200).json({
      success: true,
      message: 'Workspace updated successfully',
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
export const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Only workspace owner can delete', 403);
    }

    await Workspace.findByIdAndDelete(req.params.id);
    await deleteCacheByPattern(`workspaces:${req.user._id}:*`);

    res.status(200).json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite member to workspace
// @route   POST /api/workspaces/:id/invite
export const inviteMember = async (req, res, next) => {
  try {
    const { email, role = 'member' } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Check permission
    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!member || member.role !== 'admin') {
      throw new AppError('Only admins can invite members', 403);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found with this email', 404);
    }

    // Check if already member
    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (alreadyMember) {
      throw new AppError('User is already a member', 409);
    }

    workspace.members.push({ user: user._id, role });
    await workspace.save();

    res.status(200).json({
      success: true,
      message: 'Member invited successfully',
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join workspace via invite code
// @route   POST /api/workspaces/join/:code
export const joinByInviteCode = async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      inviteCode: req.params.code,
    });

    if (!workspace) {
      throw new AppError('Invalid invite code', 404);
    }

    // Check if already member
    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      throw new AppError('You are already a member', 409);
    }

    workspace.members.push({ user: req.user._id, role: 'member' });
    await workspace.save();

    res.status(200).json({
      success: true,
      message: 'Joined workspace successfully',
      workspace,
    });
  } catch (error) {
    next(error);
  }
};