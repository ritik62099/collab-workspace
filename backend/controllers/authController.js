import { registerUser, loginUser } from '../services/authService.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    // ✅ workspaceId aur inviteCode ko bhi extract karo
    const { name, email, password, workspaceId, inviteCode } = req.body;

    const result = await registerUser({ name, email, password, workspaceId, inviteCode });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};




// @desc    Change Password
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) throw new AppError('User not found', 404);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect', 401);

    // Update password
    user.password = newPassword;
    await user.save(); // pre('save') hook automatically hashes it

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};