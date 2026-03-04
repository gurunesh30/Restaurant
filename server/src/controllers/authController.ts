import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vignesh112847@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vignesh1128';

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────
// POST /api/auth/register
// ───────────────────────────────────────────────────────────────
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
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role, provider: 'local' });
    sendTokenResponse(res, user, 201);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
};

// ───────────────────────────────────────────────────────────────
// POST /api/auth/login
// ───────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    // Hard-coded admin shortcut
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let adminUser = await User.findOne({ email }).select('+password');
      if (!adminUser) {
        adminUser = await User.create({ name: 'Admin', email, password, role: 'admin', provider: 'local' });
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }
      sendTokenResponse(res, adminUser);
      return;
    }

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

// ───────────────────────────────────────────────────────────────
// GET /api/auth/google/callback  (Google OAuth)
// ───────────────────────────────────────────────────────────────
export const googleAuthCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = signToken(user._id.toString(), user.role);
  const frontendURL = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${frontendURL}/login-success?token=${token}`);
};

// ───────────────────────────────────────────────────────────────
// GET /api/auth/me  — full profile (all fields except password)
// ───────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    const user = await User.findById(userId).select('-password');
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' }); return; }
    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
};

// ───────────────────────────────────────────────────────────────
// PATCH /api/auth/profile  — update optional profile fields
// ───────────────────────────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    const { name, phone, bio, dateOfBirth, address } = req.body;

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth || null;
    if (address !== undefined) {
      updates['address.street'] = address.street ?? '';
      updates['address.city'] = address.city ?? '';
      updates['address.state'] = address.state ?? '';
      updates['address.pincode'] = address.pincode ?? '';
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, select: '-password' }
    );
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' }); return; }
    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
};

// ───────────────────────────────────────────────────────────────
// GET /api/auth/logout
// ───────────────────────────────────────────────────────────────
export const logout = (req: Request, res: Response): void => {
  req.logout((err: any) => {
    if (err) { res.status(500).json({ success: false, message: 'Logout failed' }); return; }
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  });
};