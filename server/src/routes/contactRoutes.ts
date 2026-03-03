import { Router } from 'express';
import { submitContact, getContacts, markRead } from '../controllers/contactController.js';

const router = Router();

router.post('/', submitContact);  // public
router.get('/', getContacts);    // admin only (add auth middleware later)
router.patch('/:id/read', markRead);       // admin only

export default router;
