const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts, getProductById } = require("../controllers/product.controller");
const { protect } = require("../middleware/protect.middleware");
const { Admin } = require("../middleware/admin.middleware");
const { upload } = require("../middleware/multer.middleware");

router.post("/", protect, Admin, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router