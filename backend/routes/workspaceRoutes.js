import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  joinByInviteCode,
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);
router
  .route('/:id')
  .get(protect, getWorkspaceById)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

router.post('/:id/invite', protect, inviteMember);
router.post('/join/:code', protect, joinByInviteCode);

export default router;