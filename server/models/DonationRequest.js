const mongoose = require('mongoose');


const donationRequestSchema = new mongoose.Schema({



 

  name: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  organ: { type: String, required: true },
  medicalHistory: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Rejected', 'Accepted'], // Example values
    default: 'Pending',
  },
  requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
