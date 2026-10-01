const express = require("express");
const { createOrder, getAllOrders, myOrders, updateOrderStatus, cancelOrder } = require("../controllers/order.controller");
const { protect } = require("../middleware/protect.middleware");
const { Admin } = require("../middleware/admin.middleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, Admin, getAllOrders);
router.get("/my-orders", protect, myOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/", protect, Admin, updateOrderStatus);
router.put("/:id", protect, Admin, updateOrderStatus);

module.exports = router;