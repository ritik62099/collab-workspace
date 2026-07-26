import express from 'express';
import {
  createCard,
  getCardById,
  updateCard,
  moveCard,
  deleteCard,
  getMyTasks,
} from '../controllers/cardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createCard);
router
  .route('/:id')
  .get(protect, getCardById)
  .put(protect, updateCard)
  .delete(protect, deleteCard);
router.put('/:id/move', protect, moveCard);

router.get('/my-tasks', protect, getMyTasks);

export default router;