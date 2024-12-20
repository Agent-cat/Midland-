const Contact = require("../Models/contact.model");
const asyncHandler = require("express-async-handler");

const createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
});

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find()
    .populate("propertyId")
    .populate("userId")
    .sort({ createdAt: -1 });
  res.status(200).json(contacts);
});

const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.status(200).json(contact);
});

module.exports = { createContact, getContacts, updateContactStatus };
