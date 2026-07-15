import List from '../models/List.js';
import Card from '../models/Card.js';
import { AppError } from '../utils/errorHandler.js';

// @desc    Create list
// @route   POST /api/lists
export const createList = async (req, res, next) => {
  try {
    const { title, boardId } = req.body;

    // Get max order
    const lastList = await List.findOne({ board: boardId }).sort({ order: -1 });
    const order = lastList ? lastList.order + 1 : 0;

    const list = await List.create({
      title,
      board: boardId,
      order,
    });

    res.status(201).json({
      success: true,
      message: 'List created successfully',
      list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update list
// @route   PUT /api/lists/:id
export const updateList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      throw new AppError('List not found', 404);
    }

    list.title = req.body.title || list.title;
    await list.save();

    res.status(200).json({
      success: true,
      message: 'List updated successfully',
      list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete list
// @route   DELETE /api/lists/:id
export const deleteList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      throw new AppError('List not found', 404);
    }

    await Card.deleteMany({ list: list._id });
    await List.findByIdAndDelete(list._id);

    res.status(200).json({
      success: true,
      message: 'List deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder list
// @route   PUT /api/lists/:id/reorder
export const reorderList = async (req, res, next) => {
  try {
    const { newIndex } = req.body;
    const list = await List.findById(req.params.id);
    if (!list) {
      throw new AppError('List not found', 404);
    }

    const allLists = await List.find({ board: list.board }).sort({ order: 1 });
    const [movedList] = allLists.splice(list.order, 1);
    allLists.splice(newIndex, 0, movedList);

    // Update orders
    for (let i = 0; i < allLists.length; i++) {
      allLists[i].order = i;
      await allLists[i].save();
    }

    res.status(200).json({
      success: true,
      message: 'List reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};