const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary.config");
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, productOverView, portion } = req.body

        if (!name || !price || !description || !productOverView) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // NOTE: isProductExists check fixed (was !isProductExists)
        const isProductExists = await Product.findOne({ name });
        if (isProductExists) {
            return res.status(400).json({ message: `${name} already exists` })
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a product image."
            })
        }

        let imageUrl = ""
        try {
            const result = await cloudinary.uploader.upload(req.file.path)
            console.log("Uploaded Cloudinary URL:", result.secure_url);
            imageUrl = result.secure_url;

            const newProduct = await Product.create({
                name,
                price,
                description,
                category,
                productOverView,
                imageUrl,
                portion
            })

            return res.status(200).json({
                message: "Product created successfully",
                product: newProduct
            })
        } catch (error) {
            console.log("Error while creating image", error);
            return res.status(500).json({ message: "Error while creating image" })
        }
    } catch (error) {
        console.log("Error while creating product", error);
        return res.status(500).json({ message: "Error while creating product" })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find();

        if (allProducts.length === 0) {
            return res.status(404).json({ message: "No products found", items: [] });
        }

        return res.status(200).json({ message: "Successfully get all items", items: allProducts });
    } catch (error) {
        console.log("Error while getting all products", error);
        return res.status(500).json({ message: "Something went wrong while getting all products" });
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format." });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json({ message: "Successfully get product details", product });

    } catch (error) {
        console.log("Error while getting product details:", error);
        res.status(500).json({ message: "Something went wrong while getting product details" });
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, price, description, category, productOverView, portion } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format." });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            })
        }

        let imageUrl = "";

        if (name || price || description || category || productOverView || portion || req.file) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.productOverView = productOverView || product.productOverView;
            product.portion = portion || product.portion;

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(`Updated image url ${result.secure_url}`);
                imageUrl = result.secure_url;
                product.imageUrl = imageUrl;
            }

            const updatedProduct = await product.save();
            return res.status(200).json({ message: "Product updated successfully", updatedProduct });
        } else {
            return res.status(400).json({ message: "No fields provided to update." });
        }
    } catch (error) {
        console.log("Error while updating product", error)
        res.status(500).json({ message: `Something went wrong while updating ${id}` })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Product ID is required."
            })
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found."
            })
        }

        res.status(200).json({ message: "Product deleted successfully", deletedProduct })
    } catch (error) {
        console.error("Something went wrong while deleting product", error)
        res.status(500).json({
            message: 'Something went wrong while deleting the product. Please try again.'
        })
    }
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct }