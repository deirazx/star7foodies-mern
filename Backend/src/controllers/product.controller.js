const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary.config");
const mongoose = require("mongoose");
const fs = require("fs");

/**
 * Helper to safely delete local temporary files created by Multer
 */
const cleanTempFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error("Error removing temp file:", err.message);
        }
    }
};

/**
 * 1. CREATE MENU ITEM (Admin Only)
 * POST /api/products
 * Supports multipart/form-data (image file) or JSON (direct image_url)
 */
const createProduct = async (req, res) => {
    try {
        let { name, price, description, category, image_url, imageUrl, is_available, isAvailable, portion, productOverView } = req.body;

        // Input validation
        if (!name || !name.trim()) {
            cleanTempFile(req.file?.path);
            return res.status(400).json({ success: false, message: "Menu item name is required." });
        }

        if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
            cleanTempFile(req.file?.path);
            return res.status(400).json({ success: false, message: "A valid positive price is required." });
        }

        if (!description || !description.trim()) {
            cleanTempFile(req.file?.path);
            return res.status(400).json({ success: false, message: "Description is required." });
        }

        if (!category || !category.trim()) {
            cleanTempFile(req.file?.path);
            return res.status(400).json({ success: false, message: "Category is required." });
        }

        // Check for duplicate menu item name
        const existingItem = await Product.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
        if (existingItem) {
            cleanTempFile(req.file?.path);
            return res.status(400).json({
                success: false,
                message: `A menu item named "${name.trim()}" already exists.`
            });
        }

        // Handle Image: Upload via Multer file OR use direct URL
        let finalImageUrl = image_url || imageUrl || "";
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "star7foodies/menu",
                    resource_type: "image"
                });
                finalImageUrl = uploadResult.secure_url;
                cleanTempFile(req.file.path);
            } catch (uploadErr) {
                cleanTempFile(req.file.path);
                console.error("Cloudinary upload failed:", uploadErr);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload menu item image. Please try again."
                });
            }
        }

        if (!finalImageUrl) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image file or provide an image_url."
            });
        }

        // Parse optional portion & productOverView if sent as strings (e.g. from FormData)
        let parsedPortion = portion;
        if (typeof portion === "string") {
            try {
                parsedPortion = JSON.parse(portion);
            } catch (e) {
                parsedPortion = undefined;
            }
        }

        let parsedOverview = productOverView;
        if (typeof productOverView === "string") {
            try {
                parsedOverview = JSON.parse(productOverView);
            } catch (e) {
                parsedOverview = productOverView.split(",").map((s) => s.trim()).filter(Boolean);
            }
        }

        const availabilityStatus = is_available !== undefined
            ? (String(is_available) === "true" || is_available === true)
            : isAvailable !== undefined
            ? (String(isAvailable) === "true" || isAvailable === true)
            : true;

        const newProduct = await Product.create({
            name: name.trim(),
            price: Number(price),
            description: description.trim(),
            category: category.trim(),
            image_url: finalImageUrl,
            is_available: availabilityStatus,
            portion: parsedPortion,
            productOverView: parsedOverview || []
        });

        return res.status(201).json({
            success: true,
            message: "Menu item created successfully.",
            product: newProduct
        });
    } catch (error) {
        cleanTempFile(req.file?.path);
        console.error("Error creating menu item:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error while creating menu item."
        });
    }
};

/**
 * 2. READ PUBLIC MENU (Public Access)
 * GET /api/products
 * Returns ONLY available items (is_available = true)
 * Query filters: category, search, minPrice, maxPrice, sort, page, limit
 */
const getAllProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort, page, limit } = req.query;

        // Base query: Return all items unless explicitly soft-deleted/archived (is_available === false)
        const filter = { is_available: { $ne: false } };

        // Category filter
        if (category && category !== "All" && category.trim() !== "") {
            filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        }

        // Name & Description search
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ];
        }

        // Price range filtering
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice && !isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
            if (maxPrice && !isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { createdAt: -1 };
        if (sort === "price-asc" || sort === "price_asc") sortOption = { price: 1 };
        else if (sort === "price-desc" || sort === "price_desc") sortOption = { price: -1 };
        else if (sort === "name-asc" || sort === "name_asc") sortOption = { name: 1 };
        else if (sort === "name-desc" || sort === "name_desc") sortOption = { name: -1 };

        // Optional pagination
        const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 0; // 0 means return all
        const skip = (pageNum - 1) * pageSize;

        let query = Product.find(filter).sort(sortOption);
        if (pageSize > 0) {
            query = query.skip(skip).limit(pageSize);
        }

        const [items, totalCount] = await Promise.all([
            query.exec(),
            Product.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: items.length,
            total: totalCount,
            page: pageSize > 0 ? pageNum : 1,
            totalPages: pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1,
            items
        });
    } catch (error) {
        console.error("Error fetching public menu:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve menu items. Please try again."
        });
    }
};

/**
 * 3. READ ADMIN MENU DASHBOARD (Admin Only)
 * GET /api/products/admin
 * Returns ALL items (including out-of-stock/soft-deleted items)
 * Supports status filter (all, available, unavailable), search, category, and provides analytics
 */
const getAdminProducts = async (req, res) => {
    try {
        const { category, search, status, sort, page, limit } = req.query;

        const filter = {};

        // Availability / Status filter
        if (status === "available" || status === "true") {
            filter.is_available = { $ne: false };
        } else if (status === "unavailable" || status === "false" || status === "archived") {
            filter.is_available = false;
        }

        // Category filter
        if (category && category !== "All" && category.trim() !== "") {
            filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        }

        // Search filter
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ];
        }

        // Sorting
        let sortOption = { updatedAt: -1 };
        if (sort === "price-asc") sortOption = { price: 1 };
        else if (sort === "price-desc") sortOption = { price: -1 };
        else if (sort === "name-asc") sortOption = { name: 1 };
        else if (sort === "oldest") sortOption = { createdAt: 1 };

        // Pagination
        const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 0;
        const skip = (pageNum - 1) * pageSize;

        let query = Product.find(filter).sort(sortOption);
        if (pageSize > 0) {
            query = query.skip(skip).limit(pageSize);
        }

        const [items, totalMatching, totalAll, totalAvailable, totalUnavailable] = await Promise.all([
            query.exec(),
            Product.countDocuments(filter),
            Product.countDocuments({}),
            Product.countDocuments({ is_available: { $ne: false } }),
            Product.countDocuments({ is_available: false })
        ]);

        return res.status(200).json({
            success: true,
            count: items.length,
            total: totalMatching,
            stats: {
                total: totalAll,
                available: totalAvailable,
                unavailable: totalUnavailable
            },
            items
        });
    } catch (error) {
        console.error("Error fetching admin products:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve admin menu items."
        });
    }
};

/**
 * 4. READ SINGLE MENU ITEM BY ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid menu item ID format." });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Menu item not found." });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving menu item details."
        });
    }
};

/**
 * 5. UPDATE MENU ITEM (Admin Only)
 * PUT/PATCH /api/products/:id
 * Validates incoming fields and updates only requested values
 */
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            cleanTempFile(req.file?.path);
            return res.status(400).json({ success: false, message: "Invalid menu item ID format." });
        }

        const product = await Product.findById(id);
        if (!product) {
            cleanTempFile(req.file?.path);
            return res.status(404).json({ success: false, message: "Menu item not found." });
        }

        const {
            name,
            price,
            description,
            category,
            is_available,
            isAvailable,
            image_url,
            imageUrl,
            portion,
            productOverView
        } = req.body;

        // Selective Validation and Mutation
        if (name !== undefined) {
            if (!name.trim()) {
                cleanTempFile(req.file?.path);
                return res.status(400).json({ success: false, message: "Name cannot be empty." });
            }
            product.name = name.trim();
        }

        if (price !== undefined) {
            const numPrice = Number(price);
            if (isNaN(numPrice) || numPrice < 0) {
                cleanTempFile(req.file?.path);
                return res.status(400).json({ success: false, message: "Price must be a non-negative number." });
            }
            product.price = numPrice;
        }

        if (description !== undefined) {
            if (!description.trim()) {
                cleanTempFile(req.file?.path);
                return res.status(400).json({ success: false, message: "Description cannot be empty." });
            }
            product.description = description.trim();
        }

        if (category !== undefined) {
            if (!category.trim()) {
                cleanTempFile(req.file?.path);
                return res.status(400).json({ success: false, message: "Category cannot be empty." });
            }
            product.category = category.trim();
        }

        if (is_available !== undefined) {
            product.is_available = String(is_available) === "true" || is_available === true;
        } else if (isAvailable !== undefined) {
            product.is_available = String(isAvailable) === "true" || isAvailable === true;
        }

        // Handle Image Update
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "star7foodies/menu",
                    resource_type: "image"
                });
                product.image_url = uploadResult.secure_url;
                cleanTempFile(req.file.path);
            } catch (uploadErr) {
                cleanTempFile(req.file.path);
                console.error("Cloudinary update image error:", uploadErr);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload new image."
                });
            }
        } else if (image_url || imageUrl) {
            product.image_url = (image_url || imageUrl).trim();
        }

        // Portion & ProductOverview updates
        if (portion !== undefined) {
            if (typeof portion === "string") {
                try {
                    product.portion = JSON.parse(portion);
                } catch (e) {
                    // keep unchanged or ignore invalid JSON
                }
            } else {
                product.portion = portion;
            }
        }

        if (productOverView !== undefined) {
            if (typeof productOverView === "string") {
                try {
                    product.productOverView = JSON.parse(productOverView);
                } catch (e) {
                    product.productOverView = productOverView.split(",").map((s) => s.trim()).filter(Boolean);
                }
            } else if (Array.isArray(productOverView)) {
                product.productOverView = productOverView;
            }
        }

        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Menu item updated successfully.",
            product: updatedProduct
        });
    } catch (error) {
        cleanTempFile(req.file?.path);
        console.error("Error updating menu item:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update menu item."
        });
    }
};

/**
 * 6. DELETE / SOFT DELETE MENU ITEM (Admin Only)
 * DELETE /api/products/:id
 * Sets is_available to false to preserve historical orders & integrity.
 * If ?permanent=true is passed, performs physical deletion from DB.
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid menu item ID format." });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Menu item not found." });
        }

        // Hard Delete (Only if explicitly instructed via ?permanent=true)
        if (permanent === "true") {
            await Product.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: "Menu item permanently deleted from database.",
                productId: id
            });
        }

        // Soft Delete (Default behavior: preserve order relationships and audit trails)
        const updated = await Product.findByIdAndUpdate(
            id,
            { $set: { is_available: false, isAvailable: false } },
            { returnDocument: 'after' }
        );

        return res.status(200).json({
            success: true,
            message: "Menu item archived (soft-deleted). It is no longer visible on the public menu.",
            product: updated
        });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete/archive menu item."
        });
    }
};

/**
 * 7. TOGGLE AVAILABILITY STATUS (Admin Only)
 * PATCH /api/products/:id/toggle-status
 * Quick one-click stock toggle between Available and Unavailable
 */
const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid menu item ID format." });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Menu item not found." });
        }

        const newStatus = !(product.is_available === true);
        const updated = await Product.findByIdAndUpdate(
            id,
            { $set: { is_available: newStatus, isAvailable: newStatus } },
            { returnDocument: 'after' }
        );

        return res.status(200).json({
            success: true,
            message: `Menu item is now marked as ${newStatus ? "Available" : "Unavailable"}.`,
            is_available: newStatus,
            product: updated
        });
    } catch (error) {
        console.error("Error toggling item status:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to toggle menu item status."
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getAdminProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    toggleProductStatus
};