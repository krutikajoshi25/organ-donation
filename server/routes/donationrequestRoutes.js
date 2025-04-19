// const express = require('express');
// const router = express.Router();
// const DonationRequest = require('../models/DonationRequest');
// const Notification = require('../models/Notification');

// // POST - Create a new donation request
// router.post('/', async (req, res) => {
//     try {
//       const {
//         name,
//         phone,
//         gender,
//         dob,
//         city,
//         state,
//         country,
//         organ,
//         medicalHistory,
//         message
//       } = req.body;
  
//       const newRequest = new DonationRequest({
//         name,
//         phone,
//         gender,
//         dob,
//         city,
//         state,
//         country,
//         organ,
//         medicalHistory,
//         message,
//         status: 'Pending',
//         requestedAt: new Date(),
//       });
  
//       await newRequest.save();
//       res.status(201).json({ message: 'Donation request submitted', request: newRequest });
//     } catch (err) {
//       console.error('Error saving donation request:', err);
//       res.status(500).json({ message: 'Failed to submit request' });
//     }
//   });
  

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
// // PUT - Update request status
// // PUT - Update request status
// router.put('/:id', async (req, res) => {
//     try {
//       const { status } = req.body;
//       if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
//         return res.status(400).json({ message: 'Invalid status value' });
//       }
  
//       const updatedRequest = await DonationRequest.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true }
//       );
//       if (!updatedRequest) {
//         return res.status(404).json({ message: 'Request not found' });
//       }
//       // Send the response with the updated request
//       res.json({ message: 'Request updated', updatedRequest });
//   } catch (err) {
//       console.error('Error updating donation request:', err);
//       res.status(500).json({ message: 'Failed to update request' });
//   }
// });
  





// router.put('/:id', async (req, res) => {
//   try {
//     const { status } = req.body; // Extract status from the request body
    
//     // Validate that the status is one of the allowed values
//     if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value' });
//     }

//     // Find and update the donation request by ID
//     const updatedRequest = await DonationRequest.findByIdAndUpdate(
//       req.params.id,  // Use the ID from the request parameters
//       { status },     // Update the status field
//       { new: true }   // Return the updated document
//     );

//     // If the donation request does not exist
//     if (!updatedRequest) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     // Create a notification message based on the updated request
//     const notificationMessage = `${updatedRequest.name} has a donation request for ${updatedRequest.organ} - Status: ${updatedRequest.status}`;

//     // Save the notification with the required fields (message, isRead, and type)
//     await Notification.create({
//       message: notificationMessage,
//       isRead: false,  // Set initial isRead as false (can be updated later)
//       type: 'Donation Request Status Update',  // Categorize the notification
//     });

//     // Send the response with the updated request
//     res.json({ message: 'Request updated', updatedRequest });
//   } catch (err) {
//     console.error('Error updating donation request:', err);
//     res.status(500).json({ message: 'Failed to update request' });
//   }
// });


// module.exports = router;



// POST - Create a new donation request (Protected route)
// router.post('/', authenticateUser, async (req, res) => {
//   console.log("Logged-in user:", req.user);
//   try {
//     const {
//       name,
//       phone,
//       gender,
//       dob,
//       city,
//       state,
//       country,
//       organ,
//       medicalHistory,
//       message
//     } = req.body;

//     const newRequest = new DonationRequest({
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
      
//     });

//     await newRequest.save();
//     res.status(201).json({ message: 'Donation request submitted', request: newRequest });
//   } catch (err) {
//     console.error('Error saving donation request:', err);
//     res.status(500).json({ message: 'Failed to submit request' });
//   }
// });


const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const DonationRequest = require('../models/DonationRequest');
const Notification = require('../models/Notification');
const authenticateUser = require('../middlewares/authMiddleware'); // ✅ Adjust path if needed
const DonationRequestStatus = require('../models/DonationStatus');  // Adjust the path based on your file structure





router.post('/', authenticateUser, async (req, res) => {
  try {
    const recipientId = req.user.userId;
    const {
      donorId, // optional, if you already know target donor
      organ,
      message,
      name,
      phone,
      gender,
      dob,
      city,
      state,
      country,
      medicalHistory
    } = req.body;

    // ✅ Prevent duplicate organ requests by the same recipient
    const existingRequest = await DonationRequest.findOne({ recipientId, donorId, organ });

    if (existingRequest) {
      return res.status(400).json({ message: "This Organ has been registered" });
    }

    // ✅ Create the new request
    const newRequest = new DonationRequest({
      donorId,
      recipientId,
      name,
      phone,
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
    res.status(201).json({ message: 'Donation request submitted', request: newRequest });
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

// PUT - Update donation request status + Create notification
// Example PUT route in Express
// PUT - Update donation request status + Create notification
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updatedRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status: status }, // ✅ Correct this line!
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updatedRequest);  // Return the updated request to frontend
  } catch (err) {
    console.error("Error updating donation request:", err);
    res.status(500).json({ message: "Server error" });
  }
});






// GET - Fetch notifications for the logged-in user
router.get('/notifications', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});



// POST /api/donation-requests
router.post("/", async (req, res) => {
  try {
    console.log("Received donation request payload:", req.body);
    // Your existing code...
    // Make sure your DonationRequest model is imported correctly:
    // const DonationRequest = require('../models/DonationRequest');
    
    // Prevent duplicate requests...
    const { donorId, recipientId, organ } = req.body;
    const existing = await DonationRequest.findOne({ donorId, recipientId, organ });
    if (existing) {
      return res.status(409).json({ message: "Request already exists for this organ." });
    }
    
    const newRequest = new DonationRequest({ ...req.body });
    await newRequest.save();

    res.status(201).json({ message: "Request sent successfully.", request: newRequest });

  } catch (error) {
    console.error("Error saving donation request:", error);
    res.status(500).json({ message: "Failed to submit request" });
  }
});

router.put("/:id", async (req, res) => {
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status is required" });

  try {
    const updatedRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    // ✅ Correct notification with actual data
    const newNotification = new Notification({
      userId: updatedRequest.donorId || updatedRequest.recipientId,
      name: updatedRequest.name, // Must be available in your DonationRequest model
      organ: updatedRequest.organ,
      status: status,
      message: `Your donation request for ${updatedRequest.organ} has been ${status}.`,
    });
    await newNotification.save();
    

    res.json(updatedRequest);
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
