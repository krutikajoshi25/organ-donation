const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  organRequired: [{ type: String, required: true }], // Multiple organs selection
  urgencyLevel: { type: String, required: true, enum: ["Low", "Moderate", "High", "Critical"] },
  doctorContact: { type: String },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Recipient", recipientSchema);
