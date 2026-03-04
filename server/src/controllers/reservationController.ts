import type { Request, Response } from "express";
import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import mongoose from "mongoose";

// @desc    All tables with live real-time status for a given date/time
// @route   GET /api/reservations/tables?date=YYYY-MM-DD&time=TIME_SLOT
export const getTablesWithStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date, time } = req.query;

        // Fetch all tables sorted by tableNumber
        const tables = await Table.find().sort({ tableNumber: 1 });

        if (!date || !time) {
            // No time filter — just return base status from DB
            res.status(200).json({ success: true, data: tables });
            return;
        }

        // Find all currently active reservations for the requested date/time slot
        const reservations = await Reservation.find({
            date: date as string,
            time: time as string,
            status: { $in: ["confirmed", "pending"] }
        });

        const bookedTableIds = new Set(reservations.map(r => r.tableId.toString()));

        // Overlay real-time booked status on top of the table's own status
        const tablesWithStatus = tables.map(table => ({
            ...table.toObject(),
            status: bookedTableIds.has(table._id.toString()) ? "booked" : table.status,
        }));

        res.status(200).json({ success: true, data: tablesWithStatus });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load table status", error: error.message });
    }
};

// @desc    Check by date/time/guests
// @route   GET /api/reservations/availability
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date, time, guests } = req.query;

        if (!date || !time || !guests) {
            res.status(400).json({ success: false, message: "Missing required query parameters" });
            return;
        }

        const guestCount = parseInt(guests as string, 10);

        const suitableTables = await Table.find({
            capacity: { $gte: guestCount },
            status: { $ne: "unavailable" }
        });

        const reservations = await Reservation.find({
            date: date as string,
            time: time as string,
            status: { $in: ["confirmed", "pending"] }
        });

        const bookedTableIds = reservations.map(r => r.tableId.toString());

        const availableTables = suitableTables.filter(
            table => !bookedTableIds.includes(table._id.toString()) && table.status === "available"
        );

        res.status(200).json({ success: true, data: availableTables });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to check availability", error: error.message });
    }
};

// @desc    Book a table
// @route   POST /api/reservations
export const createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customerName, customerEmail, customerPhone, tableId, date, time, guests, notes } = req.body;

        if (!customerName || !customerPhone || !tableId || !date || !time || !guests) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        // Validate the table exists
        const table = await Table.findById(tableId);
        if (!table) {
            res.status(404).json({ success: false, message: "Table not found" });
            return;
        }

        if (table.status === "unavailable") {
            res.status(400).json({ success: false, message: "Table is unavailable" });
            return;
        }

        // Prevent double booking at the same exact date/time
        const existingReservation = await Reservation.findOne({
            tableId,
            date,
            time,
            status: { $in: ["confirmed", "pending"] }
        });

        if (existingReservation) {
            res.status(409).json({ success: false, message: "Table is already booked at this time" });
            return;
        }

        let userId = null;
        if (req.user) {
            userId = req.user.id;
        }

        const reservationPayload: any = {
            customerName,
            customerEmail: customerEmail || "",
            customerPhone,
            tableId: new mongoose.Types.ObjectId(tableId),
            date,
            time,
            guests: Number(guests),
            notes: notes || "",
            status: "confirmed"   // auto-confirm on creation
        };

        if (userId) {
            reservationPayload.userId = new mongoose.Types.ObjectId(userId);
        }

        const reservation = await Reservation.create(reservationPayload);

        // Populate table info in the response
        await reservation.populate("tableId");

        res.status(201).json({ success: true, data: reservation });
    } catch (error: any) {
        console.error('[createReservation] Error:', error.message, error.errors ?? '');
        res.status(500).json({ success: false, message: "Failed to create reservation", error: error.message });
    }
};

// @desc    Current user's bookings
// @route   GET /api/reservations/my
export const getMyReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authorized" });
            return;
        }

        const reservations = await Reservation.find({ userId: req.user.id })
            .populate("tableId")
            .sort({ date: -1, time: -1 });

        res.status(200).json({ success: true, data: reservations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load your reservations", error: error.message });
    }
};

// @desc    Cancel own booking
// @route   DELETE /api/reservations/:id
export const cancelMyReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authorized" });
            return;
        }

        const reservation = await Reservation.findOne({ _id: req.params.id, userId: req.user.id } as any);
        if (!reservation) {
            res.status(404).json({ success: false, message: "Reservation not found or not yours" });
            return;
        }

        reservation.status = "cancelled";
        await reservation.save();

        res.status(200).json({ success: true, message: "Reservation cancelled", data: reservation });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to cancel reservation", error: error.message });
    }
};

// @desc    All reservations (Admin)
// @route   GET /api/reservations
export const getAllReservations = async (_req: Request, res: Response): Promise<void> => {
    try {
        const reservations = await Reservation.find()
            .populate({ path: "tableId", select: "tableNumber label capacity section floor" })
            .populate({ path: "userId", select: "name email" })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reservations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load reservations", error: error.message });
    }
};

// @desc    Update reservation status (Admin)
// @route   PATCH /api/reservations/:id/status
export const updateReservationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
            res.status(400).json({ success: false, message: "Invalid status" });
            return;
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!reservation) {
            res.status(404).json({ success: false, message: "Reservation not found" });
            return;
        }

        res.status(200).json({ success: true, data: reservation });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to update reservation status", error: error.message });
    }
};
