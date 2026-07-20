import Message from '../models/Message.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

// Get all conversations (users list)
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all messages where user is sender or receiver
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          avatar: '$user.avatar',
          email: '$user.email',
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            sender: '$lastMessage.sender',
          },
          unreadCount: 0, // Will calculate separately
        },
      },
    ]);

    res.status(200).json({
      success: true,
      conversations: messages,
    });
  } catch (error) {
    next(error);
  }
};

// Get messages between two users
export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name avatar email')
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// Send message
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    if (!content || !content.trim()) {
      throw new AppError('Message content is required', 400);
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar email');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (for chat list)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ 
      _id: { $ne: req.user._id },
      isActive: true 
    })
    .select('name avatar email lastLogin')
    .sort({ name: 1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};