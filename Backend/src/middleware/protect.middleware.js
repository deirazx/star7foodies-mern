const jwt = require("jsonwebtoken");
const User = require("../models/auth.model")
require("dotenv").config();

const protect = async (req, res, next) => {
    try {
        const token = req.cookie.token

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedToken.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized, user not found"
            })
        }
        next()
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
}

module.exports = { protect }