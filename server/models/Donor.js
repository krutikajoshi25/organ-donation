const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  organType: [{ type: String, required: true }], // Multiple organs selection
  password: { type: String, required: true },
});

module.exports = mongoose.model("Donor", donorSchema);
