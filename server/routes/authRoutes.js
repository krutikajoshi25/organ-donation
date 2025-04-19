const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const Admin = require("../models/Admin"); // ⬅ Add this import

const router = express.Router();

// Login API
// 

// Recipient Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if recipient exists
    const recipient = await Recipient.findOne({ email });
    if (!recipient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, recipient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: recipient._id, role: "recipient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    // ✅ Send full recipient data along with token
    res.status(200).json({
      message: "Login successful",
      token,
      recipient, // 👈 this will include fullName, phone, dob, etc.
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Admin Login Route (separate from regular login)
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, message: "Admin login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin Register Route (for one-time setup)
router.post("/admin/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
