const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdminMiddleware");

const router = express.Router();

// Protected Route - Only authenticated users can access
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});
router.get("/admin-section", authMiddleware, isAdmin, (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

module.exports = router;
