const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipient = require("../models/Recipient");

const router = express.Router();

// Recipient Registration
router.post("/register", async (req, res) => {
  const { fullName, email, phone, gender, dob, city, state, country, organRequired, urgencyLevel, doctorContact, password } = req.body;

  try {
    // Check if email already exists
    const existingRecipient = await Recipient.findOne({ email });
    if (existingRecipient) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new recipient
    const newRecipient = new Recipient({
      fullName,
      email,
      phone,
      gender,
      dob,
      city,
      state,
      country,
      organRequired,
      urgencyLevel,
      doctorContact,
      password: hashedPassword
    });

    await newRecipient.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newRecipient._id, role: "recipient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Recipient registered successfully", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
