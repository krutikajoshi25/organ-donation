const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  organRequired: { type: String, required: true },
  urgencyLevel: { type: String, required: true },
  doctorContact: { type: String, required: false},
  password: { type: String, required: true }
});

const Recipient = mongoose.model('Recipient', recipientSchema);
module.exports = Recipient;
