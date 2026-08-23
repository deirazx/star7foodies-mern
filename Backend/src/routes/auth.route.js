const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, logoutUser } = require("../controllers/auth.controller")
const { protect } = require("../middleware/protect.middleware")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/current-user", protect, getCurrentUser);
router.post("/logout-user", protect, logoutUser);

module.exports = router