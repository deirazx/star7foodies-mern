const User = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { options } = require("../utils/cookieOptions")

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const newUser = new User({ name, email, password });
        const user = await newUser.save()

        res.status(201).json({
            message: "Account created successfully.",
            user
        })
    } catch (error) {
        console.log("Error while registering user", error);
        res.status(500).json({ message: "Error while creating user", error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist! Please signup first" })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken(user._id)

        res
            .status(200)
            .cookie("token", token, options)
            .json({
                message: "User logged in successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })

    } catch (error) {
        console.log("Something went wrong while logging user", error);
        res.status(500).json({ message: "Something went wrong while logging user" })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            message: "Current User",
            user: req.user
        })
    } catch (error) {
        console.log("Error while getting current user", error)
        res.status(400).json({
            message: "Error while getting current user"
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res
            .status(200)
            .clearCookie("token", options)
            .json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Logout Error", error);
        res.status(400).json({
            message: "Logout error"
        })
    }
}


module.exports = { registerUser, loginUser, getCurrentUser, logoutUser }