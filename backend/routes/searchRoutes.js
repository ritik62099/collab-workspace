import express from 'express';
import { globalSearch, getSearchSuggestions } from '../controllers/searchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, globalSearch);
router.get('/suggestions', protect, getSearchSuggestions);

export default router;