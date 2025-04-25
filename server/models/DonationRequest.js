const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', required: false },
  organ: {
    type: [String],
    enum: [
      "Kidney", "Liver", "Heart", "Lungs", "Pancreas",
      "Cornea", "Intestines", "Skin", "Bone Marrow", "Tissue"
    ],
    required: true,
  },
  
  message: { type: String, required: true },
  name: String,
  phone: String,
  email: String,  
  gender: String,
  dob: Date,
  city: String,
  state: String,
  country: String,
  medicalHistory: String,
  status: {
    type: String, 
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  email: { type: String, required: true }, // Add the email field here
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
}, { timestamps: true });


const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);

module.exports = DonationRequest;
