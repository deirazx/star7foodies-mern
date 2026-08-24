const Order = require("../models/order.model");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
    try {
        const { userId, items, address, totalCartPrice } = req.body;

        // Resolve userId: prioritize req.user._id from protect middleware, fallback to body
        const resolvedUserId = req.user ? req.user._id : userId;

        if (!resolvedUserId || !items || !totalCartPrice || !address) {
            return res.status(400).json({
                message: "Please provide all required order details."
            });
        }

        // Validate address structure
        if (typeof address !== "object") {
            return res.status(400).json({ message: "Invalid address format." });
        }
        const { street, city, postalCode, phone } = address;
        if (!street || !city || !postalCode || !phone) {
            return res.status(400).json({
                message: "Street, city, postal code, and phone number are required in the address."
            });
        }

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item."
            });
        }

        const newOrder = new Order({
            userId: resolvedUserId,
            items,
            address,
            totalCartPrice
        });

        const order = await newOrder.save();
        console.log(`Order Placed Successfully: ${order._id}`);

        return res.status(201).json({
            message: "Order has been created successfully.",
            order
        });
    } catch (error) {
        console.error("Error while placing order:", error);
        return res.status(500).json({
            message: "Something went wrong while placing the order. Please try again."
        });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find();

        if (allOrders.length === 0) {
            return res.status(404).json({
                message: "No orders found."
            });
        }

        return res.status(200).json({
            message: "Successfully retrieved all orders.",
            orders: allOrders
        });
    } catch (error) {
        console.error("Error while retrieving all orders:", error);
        return res.status(500).json({
            message: "Something went wrong while retrieving all orders. Please try again."
        });
    }
}

const myOrders = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Unauthorized. User details not found."
            });
        }

        const { _id } = req.user;

        const orders = await Order.find({ userId: _id }).populate("items.productId");

        console.log(`Fetched Orders for user ${_id}:`, orders.length);

        return res.status(200).json({
            message: "Orders retrieved successfully.",
            orders
        });

    } catch (error) {
        console.error("Error while retrieving my orders:", error);
        return res.status(500).json({
            message: "Something went wrong while retrieving your orders. Please try again."
        });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        // Robust check: Support id from route parameter (:id) or request body
        const id = req.params.id || req.body.id;
        const { status } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                message: "Order ID and status are required."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "The order ID provided is invalid."
            });
        }

        // Validate status value against schema enum
        const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid order status. Allowed statuses are: ${validStatuses.join(", ")}`
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: "Order status has been updated successfully.",
            order
        });
    } catch (error) {
        console.error("Something went wrong while updating status:", error);
        return res.status(500).json({
            message: "Something went wrong while updating the order status. Please try again."
        });
    }
}

module.exports = { createOrder, getAllOrders, myOrders, updateOrderStatus }