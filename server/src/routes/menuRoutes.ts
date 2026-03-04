import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
    getMenuItems,
    getTrendingItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
} from '../controllers/menuController.js';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/trending', getTrendingItems);
router.get('/:id', getMenuItemById);

router.post('/', protect, adminOnly, upload.single('image'), createMenuItem);
router.put('/:id', protect, adminOnly, (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("Multer/Cloudinary upload error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
            res.status(400).json({ success: false, message: "Image upload failed", error: String(err.message || err) });
            return;
        }
        next();
    });
}, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);
router.patch('/:id/toggle', protect, adminOnly, toggleAvailability);
router.patch('/:id/trending', protect, adminOnly, async (req, res) => {
    const { default: MenuItem } = await import('../models/MenuItem.js');
    const item = await MenuItem.findById(req.params.id);
    if (!item) { res.status(404).json({ success: false, message: 'Item not found' }); return; }
    item.isTrending = !item.isTrending;
    await item.save();
    res.json({ success: true, data: item });
});

export default router;

