import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleAuthCallback,
  getMe,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Local auth ─────────────────────────────────────────────────
// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// ── Google OAuth ───────────────────────────────────────────────
// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' }),
  googleAuthCallback
);

// ── Protected ─────────────────────────────────────────────────
// GET /api/auth/me
router.get('/me', protect, getMe);

// GET /api/auth/logout
router.get('/logout', logout);

export default router;