const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectDB = require("./Database/db.js");
const propertyRoutes = require("./Routes/property.routes.js");
const authRoutes = require("./Routes/auth.routes.js");
const feedbackRoutes = require("./Routes/feedback.routes.js");
const contactRoutes = require("./Routes/contact.routes.js");
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contacts", contactRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
