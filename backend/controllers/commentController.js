import Comment from '../models/Comment.js';
import Card from '../models/Card.js';
import { AppError } from '../utils/errorHandler.js';

// @route   POST /api/cards/:cardId/comments
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new AppError('Card not found', 404);
    }

    const comment = await Comment.create({
      text,
      card: req.params.cardId,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to edit this comment', 403);
    }

    comment.text = req.body.text;
    comment.isEdited = true;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    next(error);
  }
};