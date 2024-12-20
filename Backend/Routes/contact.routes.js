const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContactStatus,
} = require("../controllers/contact.controller");

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", updateContactStatus);

module.exports = router;
