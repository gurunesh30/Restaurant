import type { Request, Response } from "express";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

// @desc    Get all items
// @route   GET /api/menu
export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, search, available, isVeg, page = "1", limit = "12", sort } = req.query;

        const query: any = {};

        if (categoryId) {
            query.category = categoryId as string;
        }

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (available !== undefined) {
            query.available = available === "true";
        }

        if (isVeg !== undefined) {
            query.isVeg = isVeg === "true";
        }

        let sortOption: any = {};
        if (sort === "price_asc") {
            sortOption.price = 1;
        } else if (sort === "price_desc") {
            sortOption.price = -1;
        } else if (sort === "rating") {
            sortOption.rating = -1;
        } else {
            sortOption.createdAt = -1;
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const items = await MenuItem.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate("category");

        const total = await MenuItem.countDocuments(query);

        res.status(200).json({
            success: true,
            data: items,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load menu items", error: error.message });
    }
};

// @desc    Get trending items
// @route   GET /api/menu/trending
export const getTrendingItems = async (_req: Request, res: Response): Promise<void> => {
    try {
        const items = await MenuItem.find({ isTrending: true, available: true })
            .limit(10)
            .populate("category");

        res.status(200).json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load trending items", error: error.message });
    }
};

// @desc    Get single item
// @route   GET /api/menu/:id
export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await MenuItem.findById(req.params.id).populate("category");
        if (!item) {
            res.status(404).json({ success: false, message: "Menu item not found" });
            return;
        }

        res.status(200).json({ success: true, data: item });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load menu item", error: error.message });
    }
};

// @desc    Create menu item
// @route   POST /api/menu
export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, categoryId, isVeg, isTrending } = req.body;

        if (!name || !description || !price || !categoryId || isVeg === undefined) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ success: false, message: "Image is required" });
            return;
        }

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }

        const image = {
            url: req.file.path,
            public_id: req.file.filename,
        };

        const createPayload = {
            name,
            description,
            price: Number(price),
            category: new mongoose.Types.ObjectId(categoryId),
            image,
            isVeg: isVeg === "true" || isVeg === true,
            isTrending: isTrending === "true" || isTrending === true,
        };

        const item = await MenuItem.create(createPayload);

        res.status(201).json({ success: true, data: item });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to create menu item", error: error.message });
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, categoryId, isVeg, isTrending, available } = req.body;
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            res.status(404).json({ success: false, message: "Menu item not found" });
            return;
        }

        if (name) item.name = name;
        if (description) item.description = description;
        if (price) item.price = Number(price);
        if (categoryId) {
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                res.status(404).json({ success: false, message: "Category not found" });
                return;
            }
            item.category = new mongoose.Types.ObjectId(categoryId) as any;
        }
        if (isVeg !== undefined) item.isVeg = isVeg === "true" || isVeg === true;
        if (isTrending !== undefined) item.isTrending = isTrending === "true" || isTrending === true;
        if (available !== undefined) item.available = available === "true" || available === true;

        if (req.file) {
            item.image = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        const updatedItem = await item.save();
        res.status(200).json({ success: true, data: updatedItem });
    } catch (error: any) {
    console.error("================ ERROR DETECTED ================");
    console.log("Type of error:", typeof error);
    console.log("Message:", error.message);
    
    // This will force the object to reveal itself even if it's a circular structure
    console.dir(error, { depth: null }); 
    
    res.status(500).json({ 
        success: false, 
        message: "Check your terminal for the detailed crash log", 
        error: error.message || "Unknown error"
    });
    console.error("Raw error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, message: "Menu item not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Menu item deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to delete menu item", error: error.message });
    }
};

// @desc    Toggle availability
// @route   PATCH /api/menu/:id/toggle
export const toggleAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, message: "Menu item not found" });
            return;
        }

        item.available = !item.available;
        await item.save();

        res.status(200).json({ success: true, data: item });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to toggle availability", error: error.message });
    }
};
