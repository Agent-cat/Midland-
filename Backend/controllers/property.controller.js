const Property = require("../Models/properties.model");
const asyncHandler = require("express-async-handler");
const User = require("../Models/user.model.js");
const mongoose = require("mongoose");
const PropertyView = require("../Models/propertyView.model");

const postproperty = asyncHandler(async (req, res) => {
  const existingProperty = await Property.findOne({
    name: req.body.name,
    location: req.body.location,
    address: req.body.address,
  });

  if (existingProperty) {
    return res.status(409).json({
      message: "Property already exists",
      property: existingProperty,
    });
  }

  const property = await Property.create(req.body);

  if (property) {
    res.status(201).json({
      message: "Property created successfully",
      property: property,
    });
  } else {
    res.status(400);
    throw new Error("Invalid property data");
  }
});

const getallproperties = asyncHandler(async (req, res) => {
  const properties = await Property.find();
  res.status(200).json(properties);
});

const updateproperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "Property updated successfully",
    property: updatedProperty,
  });
});

const deleteproperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  await property.deleteOne();
  res.status(200).json({ message: "Property deleted successfully" });
});

const getpropertybyid = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  res.status(200).json(property);
});

const addToCart = asyncHandler(async (req, res) => {
  const { userId, propertyId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (user.cart.includes(property._id)) {
    res.status(400);
    throw new Error("Property already in cart");
  }

  user.cart.push(property._id);
  await user.save();

  res.status(200).json({
    message: "Property added to cart successfully",
    cart: user.cart,
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, propertyId } = req.body;

  // Validate userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  user.cart = user.cart.filter(
    (id) => id.toString() !== property._id.toString()
  );
  await user.save();

  res.status(200).json({
    message: "Property removed from cart successfully",
    cart: user.cart,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate("cart");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.cart);
});

const recordPropertyView = asyncHandler(async (req, res) => {
  try {
    const { userId, phone } = req.body;
    const propertyId = req.params.id;

    // Check if user has viewed this property in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = await PropertyView.findOne({
      userId,
      propertyId,
      viewedAt: { $gt: oneHourAgo }
    });

    if (existingView) {
      // Update existing view with new timestamp
      existingView.viewedAt = new Date();
      await existingView.save();
    } else {
      // Create new view record
      await PropertyView.create({
        userId,
        propertyId,
        phone,
        viewedAt: new Date()
      });
    }

    res.status(200).json({ message: "Property view recorded successfully" });
  } catch (error) {
    console.error("Error recording property view:", error);
    res.status(500).json({ message: "Error recording property view" });
  }
});

module.exports = {
  postproperty,
  getallproperties,
  updateproperty,
  deleteproperty,
  getpropertybyid,
  addToCart,
  removeFromCart,
  getCart,
  recordPropertyView,
};
