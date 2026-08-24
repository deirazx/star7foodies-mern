const express = require("express");
const { createOrder, getAllOrders, myOrders, updateOrderStatus } = require("../controllers/order.controller");
const { protect } = require("../middleware/protect.middleware");
const { Admin } = require("../middleware/admin.middleware");

const router = express.Router();

router.post("/", protect, Admin, createOrder);
router.get("/", protect, Admin, getAllOrders);
router.get("/my-orders", protect, myOrders);
router.put("/", protect, Admin, updateOrderStatus);

module.exports = router;