const Product = require("../models/product.model");
const cloudinary = require("../config/cloudinary.config")

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

module.exports = { createProduct }