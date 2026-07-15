import express from 'express';
import {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createBoard);
router.get('/workspace/:workspaceId', protect, getBoardsByWorkspace);
router
  .route('/:id')
  .get(protect, getBoardById)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

export default router;