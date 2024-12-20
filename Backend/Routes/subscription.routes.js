const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getSubscriptionStatus,
  cancelSubscription,
} = require("../controllers/subscription.controller.js");

router.post("/create", createSubscription);
router.get("/status/:userId", getSubscriptionStatus);
router.post("/cancel", cancelSubscription);

module.exports = router;
