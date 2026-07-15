import Card from '../models/Card.js';
import List from '../models/List.js';
import { AppError } from '../utils/errorHandler.js';

// @desc    Create card
// @route   POST /api/cards
export const createCard = async (req, res, next) => {
  try {
    const { title, description, listId, boardId } = req.body;

    const list = await List.findById(listId);
    if (!list) {
      throw new AppError('List not found', 404);
    }

    // Get max order in list
    const lastCard = await Card.findOne({ list: listId }).sort({ order: -1 });
    const order = lastCard ? lastCard.order + 1 : 0;

    const card = await Card.create({
      title,
      description,
      list: listId,
      board: boardId,
      createdBy: req.user._id,
      order,
    });

    const populatedCard = await Card.findById(card._id)
      .populate('assignees', 'name avatar')
      .populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      card: populatedCard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get card by ID
// @route   GET /api/cards/:id
export const getCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('assignees', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: -1 } },
      });

    if (!card) {
      throw new AppError('Card not found', 404);
    }

    res.status(200).json({
      success: true,
      card,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update card
// @route   PUT /api/cards/:id
export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new AppError('Card not found', 404);
    }

    const allowedFields = ['title', 'description', 'assignees', 'labels', 'dueDate'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        card[field] = req.body[field];
      }
    });

    await card.save();

    const updatedCard = await Card.findById(card._id)
      .populate('assignees', 'name avatar')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      card: updatedCard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move card to another list
// @route   PUT /api/cards/:id/move
export const moveCard = async (req, res, next) => {
  try {
    const { toListId, newIndex } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new AppError('Card not found', 404);
    }

    const fromListId = card.list;

    // Reorder cards in from list (remove card)
    if (fromListId.toString() !== toListId.toString()) {
      const fromCards = await Card.find({ list: fromListId })
        .sort({ order: 1 })
        .filter((c) => c._id.toString() !== card._id.toString());

      for (let i = 0; i < fromCards.length; i++) {
        fromCards[i].order = i;
        await fromCards[i].save();
      }
    }

    // Get cards in target list
    const toCards = await Card.find({ list: toListId }).sort({ order: 1 });
    toCards.splice(newIndex, 0, card);

    // Update orders
    for (let i = 0; i < toCards.length; i++) {
      toCards[i].order = i;
      if (toCards[i]._id.toString() === card._id.toString()) {
        toCards[i].list = toListId;
      }
      await toCards[i].save();
    }

    res.status(200).json({
      success: true,
      message: 'Card moved successfully',
      card: { ...card.toObject(), list: toListId, order: newIndex },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete card
// @route   DELETE /api/cards/:id
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new AppError('Card not found', 404);
    }

    await Card.findByIdAndDelete(card._id);

    res.status(200).json({
      success: true,
      message: 'Card deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};