import type { Request, Response } from "express";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find().sort({ sortOrder: 1 });

        // Populate itemCount virtually via aggregation
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const itemCount = await MenuItem.countDocuments({ category: cat._id });
                return { ...cat.toObject(), itemCount };
            })
        );

        res.status(200).json({ success: true, data: categoriesWithCount });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to load categories", error: error.message });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }

        const itemCount = await MenuItem.countDocuments({ category: category._id });
        res.status(200).json({ success: true, data: { ...category.toObject(), itemCount } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to get category", error: error.message });
    }
};

// @desc    Create a category
// @route   POST /api/categories
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, sortOrder } = req.body;

        if (!name) {
            res.status(400).json({ success: false, message: "Name is required" });
            return;
        }

        // Create the base object
        const createPayload: any = {
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            sortOrder: sortOrder || 0
        };

        if (req.file) {
            createPayload.image = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        const category = await Category.create(createPayload);

        res.status(201).json({ success: true, data: category });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, sortOrder } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }

        if (name) {
            category.name = name;
            category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        if (sortOrder !== undefined) {
            category.sortOrder = sortOrder;
        }

        if (req.file) {
            category.image = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        const updatedCategory = await category.save();
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to update category", error: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;

        const itemCount = await MenuItem.countDocuments({ category: categoryId as any });
        if (itemCount > 0) {
            res.status(400).json({ success: false, message: "Cannot delete category because it has menu items" });
            return;
        }

        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
    }
};

// @desc    Update sort order
// @route   PATCH /api/categories/:id/reorder
export const reorderCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sortOrder } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { sortOrder },
            { new: true }
        );

        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }

        res.status(200).json({ success: true, data: category });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to reorder category", error: error.message });
    }
};
