const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    qnty: {
        type: Number,
        default: 1,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    portion: {
        type: String,
        default: "Single Serving"
    }
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [productSchema],

    totalCartPrice: {
        type: Number,
        required: true
    },

    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String, required: true },
        country: { type: String, default: "india" },
        phone: { type: String, required: true }
    },

    status: {
        type: String,
        enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;