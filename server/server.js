const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // ✅ Ensure this matches your file name
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const donationRequestRoutes = require("./routes/donationrequestRoutes"); // 👈 Add this
const notificationRoutes = require('./routes/notificationRoutes'); // Import new notification route



dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());




// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/donation-requests", donationRequestRoutes); // 👈 Add this
app.use("/api/notifications", notificationRoutes); 

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    
  })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
