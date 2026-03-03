import type { Request, Response } from 'express';
import Contact from '../models/Contact.js';

/* POST /api/contact
   Public — anyone can submit a message */
export const submitContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, purpose, message } = req.body;

        if (!name || !email || !phone || !message) {
            res.status(400).json({ success: false, message: 'Name, email, phone and message are required.' });
            return;
        }

        if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
            res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number.' });
            return;
        }

        const contact = await Contact.create({ name, email, phone, purpose: purpose || 'general', message });

        res.status(201).json({
            success: true,
            message: 'Message received! We will get back to you shortly.',
            data: { id: contact._id },
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

/* GET /api/contact  — Admin: list all messages */
export const getContacts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts, total: contacts.length });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* PATCH /api/contact/:id/read  — Admin: mark as read */
export const markRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!contact) { res.status(404).json({ success: false, message: 'Message not found' }); return; }
        res.json({ success: true, data: contact });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
