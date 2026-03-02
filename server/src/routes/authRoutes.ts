import express from 'express';
import passport from 'passport';
import { 
  googleAuthCallback, 
  getMe, 
  logout 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Initiate Google Auth
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google Auth Callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

// @desc    Get current user profile
// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @desc    Logout
// @route   GET /api/auth/logout
router.get('/logout', logout);

export default router;