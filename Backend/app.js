const express = require("express");
const app = express();

// Routes
app.use("/api/properties", propertyRoutes);
