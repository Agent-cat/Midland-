const express = require("express");
const router = express.Router();
const {
  postfeedback,
  getfeedback,
  updateFeedbackStatus,
} = require("../controllers/feedback.controller.js");

router.post("/", postfeedback);
router.get("/", getfeedback);
router.put("/:id", updateFeedbackStatus);

module.exports = router;
