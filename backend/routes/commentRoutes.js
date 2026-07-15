import express from 'express';
import {
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/cards/:cardId', protect, addComment);
router
  .route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router;