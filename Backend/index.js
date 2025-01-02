require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Database/db");
const authRoutes = require("./Routes/auth.routes");
const propertyRoutes = require("./Routes/property.routes.js");
const feedbackRoutes = require("./Routes/feedback.routes.js");
const contactRoutes = require("./Routes/contact.routes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contacts", contactRoutes);

// Connect to database
connectDB();

// Add this before your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
