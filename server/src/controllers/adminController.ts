import type { Request, Response } from "express";
import User from "../models/User.js";
import Reservation from "../models/Reservation.js";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";

// @desc    Full analytics summary
// @route   GET /api/admin/dashboard
export const getDashboardSummary = async (_req: Request, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments();
        const totalReservations = await Reservation.countDocuments();
        const pendingReservations = await Reservation.countDocuments({ status: "pending" });
        const totalMenuItems = await MenuItem.countDocuments();
        const totalCategories = await Category.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalReservations,
                pendingReservations,
                totalMenuItems,
                totalCategories
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load dashboard summary", error: error.message });
    }
};

// @desc    Earnings chart (weekly/monthly) - Simulated for this project
// @route   GET /api/admin/dashboard/earnings
export const getEarningsChart = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Simplified mock earnings data since orders aren't fully tracked
        const data = [
            { id: 1, name: "Mon", total: 1200 },
            { id: 2, name: "Tue", total: 1900 },
            { id: 3, name: "Wed", total: 800 },
            { id: 4, name: "Thu", total: 1500 },
            { id: 5, name: "Fri", total: 2400 },
            { id: 6, name: "Sat", total: 3200 },
            { id: 7, name: "Sun", total: 2800 },
        ];

        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load earnings data", error: error.message });
    }
};

// @desc    Top selling items (trending ones)
// @route   GET /api/admin/dashboard/top-items
export const getTopItems = async (_req: Request, res: Response): Promise<void> => {
    try {
        const items = await MenuItem.find({ isTrending: true })
            .select("name price rating")
            .limit(5);

        res.status(200).json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load top items", error: error.message });
    }
};

// @desc    Booking counts by status
// @route   GET /api/admin/dashboard/bookings-summary
export const getBookingsSummary = async (_req: Request, res: Response): Promise<void> => {
    try {
        const summary = await Reservation.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedSummary = summary.map(item => ({
            status: item._id,
            count: item.count
        }));

        res.status(200).json({ success: true, data: formattedSummary });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load bookings summary", error: error.message });
    }
};

// @desc    All registered users
// @route   GET /api/admin/users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select("-__v").sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load users", error: error.message });
    }
};
