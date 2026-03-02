import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const googleAuthCallback = (req: Request, res: Response) => {
  const user = req.user as any;

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendURL}/login-success?token=${token}`);
};

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

export const logout = (req: Request, res: Response): void => {
  req.logout((err: any) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Logout failed' });
      return;
    }
    res.status(200).json({ success: true, message: 'Logout successful' });
    return;
  });
};