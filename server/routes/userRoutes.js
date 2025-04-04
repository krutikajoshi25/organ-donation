const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected Route - Only authenticated users can access
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;
