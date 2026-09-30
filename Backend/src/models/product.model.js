const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Menu item name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, "Menu item description is required"],
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },
        price: {
            type: Number,
            required: [true, "Menu item price is required"],
            min: [0, "Price cannot be negative"]
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            default: "Main Course"
        },
        image_url: {
            type: String,
            trim: true
        },
        imageUrl: {
            type: String,
            trim: true
        },
        is_available: {
            type: Boolean,
            default: true,
            alias: "isAvailable"
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
                trim: true
            }
        ]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                if (!ret.image_url && ret.imageUrl) ret.image_url = ret.imageUrl;
                if (!ret.imageUrl && ret.image_url) ret.imageUrl = ret.image_url;
                return ret;
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                if (!ret.image_url && ret.imageUrl) ret.image_url = ret.imageUrl;
                if (!ret.imageUrl && ret.image_url) ret.imageUrl = ret.image_url;
                return ret;
            }
        }
    }
);

// Synchronize and validate image fields before saving
productSchema.pre("validate", function () {
    if (this.imageUrl && !this.image_url) {
        this.image_url = this.imageUrl;
    } else if (this.image_url && !this.imageUrl) {
        this.imageUrl = this.image_url;
    }
    if (!this.image_url && !this.imageUrl) {
        throw new Error("Image URL is required for menu items");
    }
});

productSchema.pre("save", function () {
    if (this.imageUrl && !this.image_url) {
        this.image_url = this.imageUrl;
    } else if (this.image_url && !this.imageUrl) {
        this.imageUrl = this.image_url;
    }
});

// Compound and text indexes for fast search & filtering
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, is_available: 1 });
productSchema.index({ is_available: 1 });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;