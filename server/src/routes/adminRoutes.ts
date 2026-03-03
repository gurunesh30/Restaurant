import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
    getDashboardSummary,
    getEarningsChart,
    getTopItems,
    getBookingsSummary,
    getAllUsers
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardSummary);
router.get('/dashboard/earnings', getEarningsChart);
router.get('/dashboard/top-items', getTopItems);
router.get('/dashboard/bookings-summary', getBookingsSummary);
router.get('/users', getAllUsers);

export default router;
