
// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();
// const DonationRequest = require('../models/DonationRequest');
// const Notification = require('../models/Notification');
// const authenticateUser = require('../middlewares/authMiddleware'); // ✅ Adjust path if needed
// const DonationRequestStatus = require('../models/DonationStatus');  // Adjust the path based on your file structure





// router.post('/', authenticateUser, async (req, res) => {
//   try {
//     const recipientId = req.user.userId;
//     const {
//       donorId, // optional, if you already know target donor
//       organ,
//       message,
//       name,
//       phone,
//       gender,
//       dob,
//       city,
//       state,
//       country,
//       medicalHistory
//     } = req.body;

//     // ✅ Prevent duplicate organ requests by the same recipient
//     const existingRequest = await DonationRequest.findOne({ recipientId, donorId, organ });

//     if (existingRequest) {
//       return res.status(400).json({ message: "This Organ has been registered" });
//     }

//     // ✅ Create the new request
//     const newRequest = new DonationRequest({
//       donorId,
//       recipientId,
//       name,
//       phone,
//       gender,
//       dob,
//       city,
//       state,
//       country,
//       organ,
//       medicalHistory,
//       message,
//       status: 'Pending',
//       requestedAt: new Date(),
//       createdBy: recipientId
//     });

//     await newRequest.save();
//     res.status(201).json({ message: 'Donation request submitted', request: newRequest });
//   } catch (err) {
//     console.error('Error saving donation request:', err);
//     res.status(500).json({ message: 'Failed to submit request' });
//   }
// });







// // GET - Admin fetch all donation requests
// router.get('/', async (req, res) => {
//   try {
//     const requests = await DonationRequest.find().sort({ requestedAt: -1 });
//     res.status(200).json(requests);
//   } catch (err) {
//     console.error('Error fetching donation requests:', err);
//     res.status(500).json({ message: 'Failed to fetch requests' });
//   }
// });

// // PUT - Update donation request status + Create notification
// // Example PUT route in Express
// // PUT - Update donation request status + Create notification
// router.put("/:id", async (req, res) => {
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ message: "Status is required" });
//   }

//   try {
//     const updatedRequest = await DonationRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: status }, // ✅ Correct this line!
//       { new: true }
//     );

//     if (!updatedRequest) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     res.json(updatedRequest);  // Return the updated request to frontend
//   } catch (err) {
//     console.error("Error updating donation request:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });






// // GET - Fetch notifications for the logged-in user
// router.get('/notifications', authenticateUser, async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

//     res.status(200).json(notifications);
//   } catch (err) {
//     console.error('Error fetching notifications:', err);
//     res.status(500).json({ message: 'Failed to fetch notifications' });
//   }
// });



// // POST /api/donation-requests
// router.post("/", async (req, res) => {
//   try {
//     console.log("Received donation request payload:", req.body);
//     // Your existing code...
//     // Make sure your DonationRequest model is imported correctly:
//     // const DonationRequest = require('../models/DonationRequest');
    
//     // Prevent duplicate requests...
//     const { donorId, recipientId, organ } = req.body;
//     const existing = await DonationRequest.findOne({ donorId, recipientId, organ });
//     if (existing) {
//       return res.status(409).json({ message: "Request already exists for this organ." });
//     }
    
//     const newRequest = new DonationRequest({ ...req.body });
//     await newRequest.save();

//     res.status(201).json({ message: "Request sent successfully.", request: newRequest });

//   } catch (error) {
//     console.error("Error saving donation request:", error);
//     res.status(500).json({ message: "Failed to submit request" });
//   }
// });

// // router.put("/:id", async (req, res) => {
// //   const { status } = req.body;

// //   if (!status) return res.status(400).json({ message: "Status is required" });

// //   try {
// //     const updatedRequest = await DonationRequest.findByIdAndUpdate(
// //       req.params.id,
// //       { status },
// //       { new: true }
// //     );
    
// //     // Ensure user ID is correctly assigned (donor or recipient)
// //     const newNotification = new Notification({
// //       userId: status === 'Accepted' || status === 'Rejected' 
// //               ? updatedRequest.donorId  // Notify donor
// //               : updatedRequest.recipientId, // Or notify recipient
// //       name: updatedRequest.name, // Name should be part of the request
// //       organ: updatedRequest.organ,
// //       status: status,
// //       message: `Your donation request for ${updatedRequest.organ} has been ${status}.`,
// //     });
    
// //     await newNotification.save();
// //     res.json(updatedRequest);
// //   } catch (err) {
// //     console.error("Error updating request:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });



// module.exports = router;
// donationRequestRoutes.js
const express = require('express');
const router = express.Router();
const DonationRequest = require('../models/DonationRequest');
const DonationRequestStatus = require('../models/DonationStatus');  // Assuming it's needed
const authenticateUser = require('../middlewares/authMiddleware'); // Adjust the path if needed
const Notification = require('../models/Notification'); // make sure this is at the top


// POST - Create new donation request
router.post('/', authenticateUser, async (req, res) => {
  try {
    const recipientId = req.user.userId;
    const {
      donorId,
      organ,
      message,
      name,
      phone,
      email,
      gender,
      dob,
      city,
      state,
      country,
      medicalHistory
    } = req.body;

    // Prevent duplicate organ requests by the same recipient
    const existingRequest = await DonationRequest.findOne({ recipientId, donorId, organ });

    if (existingRequest) {
      return res.status(400).json({ message: "This Organ has already been registered" });
    }

    // Create a new donation request
    const newRequest = new DonationRequest({
      donorId,
      recipientId,
      name,
      phone,
      email,
      gender,
      dob,
      city,
      state,
      country,
      organ,
      medicalHistory,
      message,
      status: 'Pending',
      requestedAt: new Date(),
      createdBy: recipientId
    });

    await newRequest.save();
    res.status(201).json({ message: 'Donation request submitted successfully', request: newRequest });
  } catch (err) {
    console.error('Error saving donation request:', err);
    res.status(500).json({ message: 'Failed to submit request' });
  }
});

// GET - Admin fetch all donation requests
router.get('/', async (req, res) => {
  try {
    const requests = await DonationRequest.find().sort({ requestedAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching donation requests:', err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// PUT - Update donation request status
// router.put("/:id", async (req, res) => {
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ message: "Status is required" });
//   }

//   try {
//     const updatedRequest = await DonationRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: status },
//       { new: true }
//     );

//     if (!updatedRequest) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     res.json(updatedRequest);  // Return the updated request to frontend
//   } catch (err) {
//     console.error("Error updating donation request:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



router.put("/:id", async (req, res) => {
  const { status } = req.body;

  // Only allow these statuses
  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be Accepted or Rejected" });
  }

  try {
    // Update the request's status
    const updatedRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ✅ Create a notification for the recipient
    if (updatedRequest.recipientId) {
      const newNotification = new Notification({
        userId: updatedRequest.recipientId,
        message: `Your donation request for ${updatedRequest.organ} has been ${status}.`,
        status: status, // 🔥 Add this line
        isRead: false,
        organ: updatedRequest.organ || [],
      });
      

      await newNotification.save();
    }

    res.json(updatedRequest);
  } catch (err) {
    console.error("Error updating donation request:", err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
