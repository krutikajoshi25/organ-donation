const express = require('express');
const router = express.Router();
const DonationRequest = require('../models/DonationRequest');
const Notification = require('../models/Notification');

// POST - Create a new donation request
router.post('/', async (req, res) => {
    try {
      const {
        name,
        phone,
        gender,
        dob,
        city,
        state,
        country,
        organ,
        medicalHistory,
        message
      } = req.body;
  
      const newRequest = new DonationRequest({
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
// PUT - Update request status
// PUT - Update request status
router.put('/:id', async (req, res) => {
    try {
      const { status } = req.body;
      if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      const updatedRequest = await DonationRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }
      // Send the response with the updated request
      res.json({ message: 'Request updated', updatedRequest });
  } catch (err) {
      console.error('Error updating donation request:', err);
      res.status(500).json({ message: 'Failed to update request' });
  }
});
  





router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body; // Extract status from the request body
    
    // Validate that the status is one of the allowed values
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find and update the donation request by ID
    const updatedRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,  // Use the ID from the request parameters
      { status },     // Update the status field
      { new: true }   // Return the updated document
    );

    // If the donation request does not exist
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create a notification message based on the updated request
    const notificationMessage = `${updatedRequest.name} has a donation request for ${updatedRequest.organ} - Status: ${updatedRequest.status}`;

    // Save the notification with the required fields (message, isRead, and type)
    await Notification.create({
      message: notificationMessage,
      isRead: false,  // Set initial isRead as false (can be updated later)
      type: 'Donation Request Status Update',  // Categorize the notification
    });

    // Send the response with the updated request
    res.json({ message: 'Request updated', updatedRequest });
  } catch (err) {
    console.error('Error updating donation request:', err);
    res.status(500).json({ message: 'Failed to update request' });
  }
});


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const DonationRequest = require('../models/DonationRequest');
// const Notification = require('../models/Notification');
// const authenticateUser = require('../middlewares/authMiddleware'); // ✅ Adjust path if needed



// // POST - Create a new donation request
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
// router.put('/:id', async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     // Validate status
//     if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value' });
//     }

//     const updatedRequest = await DonationRequest.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!updatedRequest) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     // Create notification message
//     const notificationMessage = `${updatedRequest.name} has a donation request for ${updatedRequest.organ} - Status: ${updatedRequest.status}`;

//     // Create and store the notification
//     await Notification.create({
//       message: notificationMessage,
//       isRead: false,  // Notification is unread by default
//       type: 'Donation Request Status Update',  // Type of notification
//       status: updatedRequest.status,  // Donation request status (Accepted/Rejected)
//       organ: updatedRequest.organ,  // The organ being donated
//       name: updatedRequest.name,  // Donor's name
//       userId: updatedRequest.userId,  // User reference (could be donor or recipient)
//     });

//     // Send response with updated request
//     res.json({ message: 'Request updated', updatedRequest });
//   } catch (err) {
//     console.error('Error updating donation request:', err);
//     res.status(500).json({ message: 'Failed to update request' });
//   }
// });
// // GET - Fetch notifications for a specific user (donor)

// // GET - Fetch notifications for the logged-in user
// // ✅ Fetch notifications for the logged-in user
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

// module.exports = router;
