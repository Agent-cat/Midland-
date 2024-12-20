const express = require("express");
const router = express.Router();
const Property = require("../Models/properties.model");
const PropertyView = require("../Models/propertyView.model");
const asyncHandler = require("express-async-handler");
const {
  postproperty,
  getallproperties,
  updateproperty,
  deleteproperty,
  getpropertybyid,
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/property.controller.js");

// Existing property routes
router.post(
  "/",
  asyncHandler(async (req, res) => {
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
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const properties = await Property.find();
    res.status(200).json(properties);
  })
);

// New view-related routes
router.get(
  "/:propertyId/views",
  asyncHandler(async (req, res) => {
    const views = await PropertyView.find({ propertyId: req.params.propertyId })
      .populate("userId", "username email profilePicture")
      .sort("-viewedAt");
    res.json(views);
  })
);

router.post(
  "/:propertyId/views",
  asyncHandler(async (req, res) => {
    const { userId, phone } = req.body;
    const propertyId = req.params.propertyId;

    // Create new view record with phone
    const view = await PropertyView.create({
      propertyId,
      userId,
      phone,
      viewedAt: new Date(),
    });

    // Update property isViewed status and add view reference
    await Property.findByIdAndUpdate(propertyId, {
      isViewed: true,
      $push: { views: view._id },
    });

    res.status(201).json(view);
  })
);

router.put(
  "/views/:viewId",
  asyncHandler(async (req, res) => {
    const { status, remarks } = req.body;
    const view = await PropertyView.findByIdAndUpdate(
      req.params.viewId,
      { status, remarks },
      { new: true }
    );
    if (!view) {
      return res.status(404).json({ message: "View not found" });
    }
    res.json(view);
  })
);

router.get(
  "/all-views",
  asyncHandler(async (req, res) => {
    try {
      const views = await PropertyView.find()
        .populate("userId", "username email profilePicture")
        .populate("propertyId", "name location images price")
        .sort("-viewedAt");
      res.json(views);
    } catch (error) {
      console.error("Error fetching all views:", error);
      res.status(500).json({
        message: "Error fetching views",
        error: error.message,
      });
    }
  })
);

router.get("/:id", getpropertybyid);
router.put("/:id", updateproperty);
router.delete("/:id", deleteproperty);
router.post("/cart/add", addToCart);
router.post("/cart/remove", removeFromCart);
router.get("/cart/:userId", getCart);

module.exports = router;
