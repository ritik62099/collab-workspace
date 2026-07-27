import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  joinByInviteCode,
  getWorkspaceMembers,   // ✅ Import
  updateMemberRole,      // ✅ Import
  removeMember  
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);
router
  .route('/:id')
  .get(protect, getWorkspaceById)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

  router.get('/:id/members', protect, getWorkspaceMembers);
router.put('/:id/members/:userId', protect, updateMemberRole);
router.delete('/:id/members/:userId', protect, removeMember);

router.post('/:id/invite', protect, inviteMember);
router.post('/join/:code', protect, joinByInviteCode);

export default router;