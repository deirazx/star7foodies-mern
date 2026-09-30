const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
require("dotenv").config();

const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Also support Bearer token from Authorization header if present
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no authentication token provided"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found"
            });
        }

        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid or expired token"
        });
    }
};

module.exports = { protect };