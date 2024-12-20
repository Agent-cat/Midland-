const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getusers,
} = require("../controllers/auth.controllers.js");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/users", getusers);
module.exports = router;
