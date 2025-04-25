const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");

const router = express.Router();

// Donor Registration
router.post("/register", async (req, res) => {
  const { fullName, email, phone, gender, dob, city, state, country, organType, password } = req.body;

  try {
    // Check if email already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new donor
    const newDonor = new Donor({
      fullName,
      email,
      phone,
      gender,
      dob,
      city,
      state,
      country,
      organType,
      password: hashedPassword
    });

    await newDonor.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newDonor._id, role: "donor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Donor registered successfully", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Search Donors API
// router.get("/search", async (req, res) => {
//   try {
//     const { organType, city, state, country } = req.query;

//     let query = { country: "India" }; // Only fetch Indian donors

//     if (organType) query.organType = organType;
//     if (city) query.city = city;
//     if (state) query.state = state;

//     const donors = await Donor.find(query);

//     res.json({ success: true, donors });
//   } catch (error) {
//     console.error("Error searching donors:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// router.get("/search", async (req, res) => {
//   try {
//       const { organType, city, state, country } = req.query;

//       const query = {};

//       if (organType) {
//         query.organType = organType;
//         // ✅ Match any organ inside the array
//       }
//       if (city) {
//           query.city = new RegExp(`^${city}$`, "i");  // ✅ Case-insensitive match
//       }
//       if (state) {
//           query.state = new RegExp(`^${state}$`, "i"); // ✅ Case-insensitive match
//       }
//       if (country) {
//           query.country = new RegExp(`^${country}$`, "i"); // ✅ Case-insensitive match
//       }

//       const donors = await Donor.find(query);
//       res.json({ success: true, donors });

//   } catch (error) {
//       console.error("Error searching donors:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//   }
// });



router.get("/search", async (req, res) => {
  try {
    const { organType, city, state, country } = req.query;

    const query = {};

    if (organType) query.organType = organType;
    if (city) query.city = new RegExp(`^${city}$`, "i");
    if (state) query.state = new RegExp(`^${state}$`, "i");
    if (country) query.country = new RegExp(`^${country}$`, "i");

    const donors = await Donor.find(query);
    console.log("Search query:", query); // 🧠 Check what you're filtering on
    res.json({ success: true, donors });
  } catch (error) {
    console.error("Error searching donors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
