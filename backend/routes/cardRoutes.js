import express from 'express';
import {
  createCard,
  getCardById,
  updateCard,
  moveCard,
  deleteCard,
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

export default router;