import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleAuthCallback,
  getMe,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Local auth ──────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);

// ── Google OAuth ────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' }),
  googleAuthCallback
);

// ── Protected ───────────────────────────────────────────────────
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.get('/logout', logout);

export default router;
