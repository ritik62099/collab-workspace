import User from '../models/User.js';
import Workspace from '../models/Workspace.js'; // ✅ Import karo
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/errorHandler.js';

export const registerUser = async (userData) => {
  const { name, email, password, workspaceId, inviteCode } = userData; 

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({ name, email, password });

  if (workspaceId && inviteCode) {
    const workspace = await Workspace.findOne({ 
      _id: workspaceId, 
      inviteCode: inviteCode 
    });

    if (workspace) {
      workspace.members.push({ user: user._id, role: 'member' });
      await workspace.save();
    }
  }

  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async (email, password) => {
  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    token,
  };
};


