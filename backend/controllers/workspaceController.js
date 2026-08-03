import Workspace from '../models/Workspace.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { deleteCacheByPattern } from '../services/cacheService.js';
import { sendInviteEmail } from '../utils/emailService.js'; 

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




export const inviteMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Only workspace owner can invite members', 403);
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (user) {
      // ✅ SCENARIO 1: User registered hai -> In-App Notification bhejo
      const alreadyMember = workspace.members.some(
        (m) => m.user.toString() === user._id.toString()
      );
      if (alreadyMember) {
        throw new AppError('User is already a member of this workspace', 409);
      }

      await Notification.create({
        recipient: user._id,
        sender: req.user._id,
        type: 'workspace_invite',
        message: `invited you to join the workspace "${workspace.name}"`,
        resource: workspace._id,
        resourceType: 'Workspace',
      });

      return res.status(200).json({
        success: true,
        message: 'In-app invite sent successfully!',
      });
    } else {
      // ✅ SCENARIO 2: User registered NAHI hai -> Email bhejo
      const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const inviteLink = `${frontendUrl}/register?workspaceId=${workspace._id}&inviteCode=${workspace.inviteCode}`;
      
      await sendInviteEmail(email, workspace.name, inviteLink);

      return res.status(200).json({
        success: true,
        message: 'User not registered. An invite email has been sent to them.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members of a workspace
// @route   GET /api/workspaces/:id/members
export const getWorkspaceMembers = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members.user', 'name email avatar role')
      .populate('owner', 'name email avatar');

    if (!workspace) throw new AppError('Workspace not found', 404);

    // Owner ko bhi members list mein include karo (agar nahi hai toh)
    let members = workspace.members.map(m => ({
      ...m.toObject(),
      isOwner: m.user._id.toString() === workspace.owner._id.toString()
    }));

    // Check if owner is already in members array, if not, add them at the top
    const ownerExists = members.some(m => m.user._id.toString() === workspace.owner._id.toString());
    if (!ownerExists) {
      members.unshift({
        user: workspace.owner,
        role: 'admin',
        joinedAt: workspace.createdAt,
        isOwner: true
      });
    }

    res.status(200).json({ success: true, members });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member role
// @route   PUT /api/workspaces/:id/members/:userId
export const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) throw new AppError('Workspace not found', 404);

    // Only owner can change roles
    if (workspace.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Only workspace owner can change roles', 403);
    }

    const memberIndex = workspace.members.findIndex(
      (m) => m.user.toString() === req.params.userId
    );

    if (memberIndex === -1) throw new AppError('Member not found in workspace', 404);

    // Cannot change owner's role
    if (workspace.members[memberIndex].user.toString() === workspace.owner.toString()) {
      throw new AppError('Cannot change the role of the workspace owner', 400);
    }

    workspace.members[memberIndex].role = role;
    await workspace.save();

    res.status(200).json({ success: true, message: 'Role updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:userId
export const removeMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) throw new AppError('Workspace not found', 404);

    // Only owner can remove members
    if (workspace.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Only workspace owner can remove members', 403);
    }

    // Cannot remove owner
    if (req.params.userId === workspace.owner.toString()) {
      throw new AppError('You cannot remove the workspace owner', 400);
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await workspace.save();

    res.status(200).json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};