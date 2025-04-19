const mongoose = require("mongoose");

const donationRequestStatusSchema = new mongoose.Schema({
  donationRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationRequest',
  },
  status: {
      type: String, 
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Assuming you're referencing the admin model
    required: true
  }, 
}, { timestamps: true });

const DonationRequestStatus = mongoose.model("DonationRequestStatus", donationRequestStatusSchema);

module.exports = DonationRequestStatus;
