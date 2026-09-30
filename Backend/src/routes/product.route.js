const express = require("express");
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getAdminProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    toggleProductStatus
} = require("../controllers/product.controller");
const { protect } = require("../middleware/protect.middleware");
const { Admin } = require("../middleware/admin.middleware");
const { upload } = require("../middleware/multer.middleware");

// ==========================================
// 1. PUBLIC ROUTES (Accessible to all users)
// ==========================================

// GET /api/products - Fetch active menu items (supports ?category= & ?search=)
router.get("/", getAllProducts);

// ==========================================
// 2. ADMIN-ONLY ROUTES (Protected by protect + Admin)
// ==========================================

// GET /api/products/admin - Fetch all items for Admin Dashboard (includes archived/out of stock items)
// NOTE: Must be defined BEFORE /:id so Express does not treat "admin" as an :id parameter
router.get("/admin", protect, Admin, getAdminProducts);

// POST /api/products - Create a new menu item
router.post("/", protect, Admin, upload.single("image"), createProduct);

// PUT /api/products/:id - Full or partial update of a menu item
router.put("/:id", protect, Admin, upload.single("image"), updateProduct);

// PATCH /api/products/:id/toggle-status - Instant one-click toggle of availability/stock
router.patch("/:id/toggle-status", protect, Admin, toggleProductStatus);

// PATCH /api/products/:id - Partial update of a menu item
router.patch("/:id", protect, Admin, upload.single("image"), updateProduct);

// DELETE /api/products/:id - Soft delete (archive) menu item (or ?permanent=true)
router.delete("/:id", protect, Admin, deleteProduct);

// ==========================================
// 3. PARAMETERIZED ROUTES
// ==========================================

// GET /api/products/:id - Fetch single menu item by ID
router.get("/:id", getProductById);

module.exports = router;