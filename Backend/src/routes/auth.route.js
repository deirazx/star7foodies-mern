const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, logoutUser, googleLogin } = require("../controllers/auth.controller")
const { protect } = require("../middleware/protect.middleware")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/current-user", protect, getCurrentUser);
router.post("/current-user", protect, getCurrentUser);
router.get("/logout-user", protect, logoutUser);
router.post("/logout-user", protect, logoutUser);

module.exports = router