const express = require("express");
const router = express.Router();
const Property = require("../Models/properties.model");
const PropertyView = require("../Models/propertyView.model");

// ... existing routes ...

// Get views for a specific property
router.get("/:propertyId/views", async (req, res) => {
  try {
    const views = await PropertyView.find({ propertyId: req.params.propertyId })
      .populate("userId", "username email")
      .sort("-viewedAt");
    res.json(views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record a view
router.post("/:propertyId/views", async (req, res) => {
  try {
    const { userId } = req.body;
    const propertyId = req.params.propertyId;

    // Check if view already exists
    const existingView = await PropertyView.findOne({
      propertyId,
      userId,
    });

    if (existingView) {
      return res.status(200).json(existingView);
    }

    // Create new view record
    const view = await PropertyView.create({
      propertyId,
      userId,
      viewedAt: new Date(),
    });

    // Update property isViewed status and add view reference
    await Property.findByIdAndUpdate(propertyId, {
      isViewed: true,
      $push: { views: view._id },
    });

    res.status(201).json(view);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update view status
router.put("/views/:viewId", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
