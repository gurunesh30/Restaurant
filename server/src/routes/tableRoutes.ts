import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
    getTables,
    addTable,
    updateTable,
    deleteTable,
    updateTableStatus
} from '../controllers/tableController.js';

const router = express.Router();

router.get('/', getTables);
router.post('/', protect, adminOnly, addTable);
router.put('/:id', protect, adminOnly, updateTable);
router.delete('/:id', protect, adminOnly, deleteTable);
router.patch('/:id/status', protect, adminOnly, updateTableStatus);

export default router;
