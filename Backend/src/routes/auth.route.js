const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require("../controllers/auth.controller")
const { protect } = require("../middleware/protect.middleware")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/current-user", protect, getCurrentUser);

module.exports = router