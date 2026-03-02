import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

interface DecodedToken {
    id: string;
    role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
        return; 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as DecodedToken;

        const user = await User.findById(decoded.id).select('-googleId');
        
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};