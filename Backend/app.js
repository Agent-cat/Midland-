const express = require("express");
const app = express();

app.use("/api/properties", propertyRoutes);
