import type { Request, Response } from "express";
import Table from "../models/Table.js";
import Reservation from "../models/Reservation.js";

// @desc    Get all tables
// @route   GET /api/tables
export const getTables = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tables = await Table.find().sort({ tableNumber: 1 });
        res.status(200).json({ success: true, data: tables });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load tables", error: error.message });
    }
};

// @desc    Add a table
// @route   POST /api/tables
export const addTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tableNumber, capacity, shape, position, floor } = req.body;

        if (!tableNumber || !capacity || !shape || !position || !floor) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        const exactTableExists = await Table.findOne({ tableNumber });
        if (exactTableExists) {
            res.status(400).json({ success: false, message: "Table number already exists" });
            return;
        }

        const table = await Table.create({
            tableNumber,
            capacity,
            shape,
            position,
            floor,
        });

        res.status(201).json({ success: true, data: table });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to create table", error: error.message });
    }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
export const updateTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tableNumber, capacity, shape, position, floor, status } = req.body;

        const table = await Table.findById(req.params.id);
        if (!table) {
            res.status(404).json({ success: false, message: "Table not found" });
            return;
        }

        if (tableNumber) {
            const tableExists = await Table.findOne({ tableNumber, _id: { $ne: req.params.id as any } } as any);
            if (tableExists) {
                res.status(400).json({ success: false, message: "Table number already exists" });
                return;
            }
            table.tableNumber = tableNumber;
        }

        if (capacity) table.capacity = capacity;
        if (shape) table.shape = shape;
        if (position) table.position = position;
        if (floor) table.floor = floor;
        if (status !== undefined) {
            const allowedStatuses = ["available", "booked", "unavailable"];
            if (!allowedStatuses.includes(status)) {
                res.status(400).json({ success: false, message: "Invalid status" });
                return;
            }
            table.status = status;
        }

        const updatedTable = await table.save();
        res.status(200).json({ success: true, data: updatedTable });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to update table", error: error.message });
    }
};

// @desc    Remove a table
// @route   DELETE /api/tables/:id
export const deleteTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const tableId = req.params.id;

        const reservationsCount = await Reservation.countDocuments({ tableId: tableId as any });
        if (reservationsCount > 0) {
            res.status(400).json({ success: false, message: "Cannot delete table with reservations" });
            return;
        }

        const table = await Table.findByIdAndDelete(tableId);
        if (!table) {
            res.status(404).json({ success: false, message: "Table not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Table deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to delete table", error: error.message });
    }
};

// @desc    Set table availability manually
// @route   PATCH /api/tables/:id/status
export const updateTableStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!["available", "booked", "unavailable"].includes(status)) {
            res.status(400).json({ success: false, message: "Invalid status" });
            return;
        }

        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!table) {
            res.status(404).json({ success: false, message: "Table not found" });
            return;
        }

        res.status(200).json({ success: true, data: table });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to update table status", error: error.message });
    }
};
