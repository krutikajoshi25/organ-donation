const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ Good
  name: { type: String, required: true },     // ❓ may not be needed (can fetch from user if needed)
  organ: { type: String, required: true },    // ✅ Makes sense for organ-specific messages
  message: { type: String, required: true },  // ✅ Required
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
