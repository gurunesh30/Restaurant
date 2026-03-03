import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';


const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vignesh112847@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vignesh1128';

// ── Helpers ────────────────────────────────────────────────────
const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

const sendTokenResponse = (res: Response, user: any, statusCode = 200) => {
  const token = signToken(user._id.toString(), user.role);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
    },
  });
};

// ── Local Register ─────────────────────────────────────────────
// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email and password are required.' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Assign admin role if the email matches the admin email
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role, provider: 'local' });
    sendTokenResponse(res, user, 201);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
};

// ── Local Login ────────────────────────────────────────────────
// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    // Special hard-coded admin shortcut
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Find or create admin user
      let adminUser = await User.findOne({ email }).select('+password');
      if (!adminUser) {
        adminUser = await User.create({ name: 'Admin', email, password, role: 'admin', provider: 'local' });
      } else {
        // Ensure role is admin
        if (adminUser.role !== 'admin') {
          adminUser.role = 'admin';
          await adminUser.save();
        }
      }
      sendTokenResponse(res, adminUser);
      return;
    }

    // Normal user login — fetch password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.provider === 'google') {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    sendTokenResponse(res, user);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
  }
};

// ── Google OAuth Callback ──────────────────────────────────────
export const googleAuthCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = signToken(user._id.toString(), user.role);
  const frontendURL = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${frontendURL}/login-success?token=${token}`);
};

// ── Get Me ────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, data: req.user });
};

// ── Logout ────────────────────────────────────────────────────
export const logout = (req: Request, res: Response): void => {
  req.logout((err: any) => {
    if (err) { res.status(500).json({ success: false, message: 'Logout failed' }); return; }
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  });
};