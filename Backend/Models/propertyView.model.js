const mongoose = require("mongoose");

const propertyViewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["interested", "not_interested", "pending"],
    default: "pending",
  },
  remarks: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("PropertyView", propertyViewSchema);
