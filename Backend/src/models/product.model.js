const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: "Main Course"
    },

    portion: {
        half: {
            type: Number,
            min: 0
        },

        full: {
            type: Number,
            min: 0
        }
    },

    productOverView: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],

    imageUrl: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Product = mongoose.model("Product", productSchema);
module.exports = Product