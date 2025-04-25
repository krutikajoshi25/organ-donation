// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Recipient = require("../models/Recipient");
// // const authMiddleware = require("../middlewares/authMiddleware");

// const router = express.Router();

// // Recipient Registration
// router.post("/register", async (req, res) => {
//   const { fullName, email, phone, gender, dob, city, state, country, organRequired, urgencyLevel, doctorContact, password } = req.body;

//   try {
//     // Check if email already exists
//     const existingRecipient = await Recipient.findOne({ email });
//     if (existingRecipient) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new recipient
//     const newRecipient = new Recipient({
//       fullName,
//       email,
//       phone,
//       gender,
//       dob,
//       city,
//       state,
//       country,
//       organRequired,
//       urgencyLevel,
//       doctorContact,
//       password: hashedPassword
//     });

//     await newRecipient.save();

//     // Generate JWT Token
//     const token = jwt.sign(
//       { userId: newRecipient._id, name: newRecipient.fullName, recipientId: newRecipient._id },  // Send recipientId in the token payload
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(201).json({ message: "Recipient registered successfully", token });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // router.get("/me", authMiddleware, async (req, res) => {
// //   try {
// //     const recipient = await Recipient.findById(req.user.userId).select("-password");
// //     if (!recipient) {
// //       return res.status(404).json({ message: "Recipient not found" });
// //     }
// //     res.status(200).json(recipient);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });
// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recipient = require('../models/Recipient'); // Ensure this is the correct path to your model
const router = express.Router();

// Recipient Registration Route
router.post("/register", async (req, res) => {
  
  try {
    console.log("Received body:", req.body);
    const { fullName, email, phone, gender, dob, city, state, country, organRequired, urgencyLevel, doctorContact, password } = req.body;

    // Example validation or logic that might cause issues
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Assuming Recipient is a Mongoose model
    const existingRecipient = await Recipient.findOne({ email });
    if (existingRecipient) {
      return res.status(400).json({ message: "Recipient already registered" });
    }

    // Hash the password before saving (if needed)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the recipient
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
      password: hashedPassword,
    });

    await newRecipient.save();

    // Send response if everything is successful
    const token = jwt.sign(
      { userId: newRecipient._id, role: "recipient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Recipient registered successfully", token,recipient: newRecipient, });
    localStorage.setItem("user", JSON.stringify(result.recipient)); // or result.user if that's your key


  } catch (error) {
    console.error("Error during registration:", error); // Log detailed error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Optional: Get Logged-in Recipient Data (for testing the token and user validation)
router.get("/me", async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.user.userId).select("-password");
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    res.status(200).json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
