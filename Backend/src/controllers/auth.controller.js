const User = require("../models/auth.model");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password)
        if (!name || !email || !password) {
            return res.status(500).json({ message: "All fields are required" });
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
            return res.status(500).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ messsage: "User does not exists! Please signup first" })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(500).json({ message: "Invalid password" });
        }

        res.status(200).json({
            message: "User logged in successfully",
            user
        })

    } catch (error) {
        console.log("Something went wrong while loggin user", error);
        res.status(500).json({ message: "Something went wrong while loggin user" })
    }
}

module.exports = { registerUser, loginUser }