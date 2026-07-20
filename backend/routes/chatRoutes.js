import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  getAllUsers,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/conversations', getConversations);
router.get('/users', getAllUsers);
router.get('/messages/:userId', getMessages);
router.post('/send', sendMessage);

export default router;