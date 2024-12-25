const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectDB = require("./Database/db.js");
const propertyRoutes = require("./Routes/property.routes.js");
const authRoutes = require("./Routes/auth.routes.js");
const feedbackRoutes = require("./Routes/feedback.routes.js");
const contactRoutes = require("./Routes/contact.routes.js");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
};

// Initialize app with middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contacts", contactRoutes);

// Error handling
app.use(errorHandler);

// Connect to database
const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process in serverless environment
    return;
  }
};

startServer();

// Export for serverless
module.exports = app;
