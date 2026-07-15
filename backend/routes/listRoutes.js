import express from 'express';
import {
  createList,
  updateList,
  deleteList,
  reorderList,
} from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createList);
router.route('/:id').put(protect, updateList).delete(protect, deleteList);
router.put('/:id/reorder', protect, reorderList);

export default router;