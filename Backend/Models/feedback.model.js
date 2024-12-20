const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
