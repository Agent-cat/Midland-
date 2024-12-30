const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getusers,
  sendRegistrationOTP,
  verifyOTP,
} = require("../controllers/auth.controllers.js");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/users", getusers);
router.post("/send-otp", sendRegistrationOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
