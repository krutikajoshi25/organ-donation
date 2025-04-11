const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const Admin = require("../models/Admin"); // ⬅ Add this import

const router = express.Router();

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in User collection
    let user = await User.findOne({ email });

    // If not found, check in Donor collection
    if (!user) {
      user = await Donor.findOne({ email });
    }

    // If not found, check in Recipient collection
    if (!user) {
      user = await Recipient.findOne({ email });
    }

    // If still not found, return error
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({ token, message: "Login successful" });

  } catch (error) {
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
