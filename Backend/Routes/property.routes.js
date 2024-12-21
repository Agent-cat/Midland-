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
    try {
      const { userId, sellerName, ...propertyData } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "Seller ID is required" });
      }

      const existingProperty = await Property.findOne({
        name: propertyData.name,
        location: propertyData.location,
        address: propertyData.address,
      });

      if (existingProperty) {
        return res.status(409).json({
          message: "Property already exists",
          property: existingProperty,
        });
      }

      const property = await Property.create({
        ...propertyData,
        sellerId: userId,
        sellerName: sellerName,
        status: "available"
      });

      res.status(201).json({
        message: "Property created successfully",
        property: property,
      });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ 
        message: "Error creating property", 
        error: error.message 
      });
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

router.get(
  "/seller/:userId",
  asyncHandler(async (req, res) => {
    try {
      const properties = await Property.find({ sellerId: req.params.userId })
        .sort("-createdAt");
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

router.get("/:id", getpropertybyid);
router.put("/:id", updateproperty);
router.delete("/:id", deleteproperty);
router.post("/cart/add", addToCart);
router.post("/cart/remove", removeFromCart);
router.get("/cart/:userId", getCart);

// Update the verification route
router.put(
  "/:propertyId/verify",
  asyncHandler(async (req, res) => {
    try {
      const { isVerified, verificationNote, adminId } = req.body;
      console.log("Verification request:", { isVerified, verificationNote, adminId }); // Debug log
      
      // Validate adminId
      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }

      // Find the property
      const property = await Property.findById(req.params.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Update property verification fields
      const updates = {
        isVerified: isVerified,
        verificationNote: verificationNote || "",
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? adminId : null
      };

      // Use findByIdAndUpdate instead of save()
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.propertyId,
        updates,
        { new: true }
      );

      res.json({
        message: `Property ${isVerified ? 'verified' : 'unverified'} successfully`,
        property: updatedProperty
      });
    } catch (error) {
      console.error("Error in property verification:", error);
      res.status(500).json({ 
        message: "Error updating property verification status",
        error: error.message 
      });
    }
  })
);

module.exports = router;
