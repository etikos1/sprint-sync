import express from 'express';
import { suggestDescription } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js'; // Ensure only logged-in users can use AI

const router = express.Router();
router.use(protect); // Protect all AI routes

router.post('/suggest', suggestDescription);

export default router;