import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
    getTablesWithStatus,
    checkAvailability,
    createReservation,
    getMyReservations,
    cancelMyReservation,
    getAllReservations,
    updateReservationStatus
} from '../controllers/reservationController.js';

const router = express.Router();

// NOTE: these custom routes should go before `/:id` generic routes

// Public / Guest routes
router.get('/tables', getTablesWithStatus);
router.get('/availability', checkAvailability);
router.post('/', createReservation);

// Authenticated user routes
router.get('/my', protect, getMyReservations);
router.delete('/:id', protect, cancelMyReservation);

// Admin routes
router.get('/', protect, adminOnly, getAllReservations);
router.patch('/:id/status', protect, adminOnly, updateReservationStatus);

export default router;
