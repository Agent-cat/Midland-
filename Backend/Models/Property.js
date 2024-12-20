const propertySchema = new mongoose.Schema({
  // ... existing fields ...
  isViewed: {
    type: Boolean,
    default: false,
  },
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyView",
    },
  ],
});
