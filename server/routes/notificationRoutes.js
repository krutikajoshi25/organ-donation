const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// POST a new notification
router.post("/", async (req, res) => {
  try {
    const { recipientEmail, message, status,organ } = req.body;

    if (!recipientEmail || !message || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const notification = new Notification({ recipientEmail, message, status });
    await notification.save();

    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    console.error("Notification creation error:", err);
    res.status(500).json({ message: "Failed to create notification" });
  }
});

module.exports = router;
