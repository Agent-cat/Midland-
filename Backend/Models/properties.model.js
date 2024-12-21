const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "flats",
        "houses",
        "villas",
        "shops",
        "agriculture land",
        "residential land",
        "farmhouse",
      ],
      required: true,
    },
    sqft: { type: Number, required: true },
    location: {
      type: String,
      enum: ["vijayawada", "amravathi", "guntur"],
      required: true,
    },
    bhk: { type: Number, required: true },
    isFavourite: { type: Boolean, default: false },
    address: { type: String, required: true },
    ownerName: { type: String, required: true },
    saleOrRent: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    price: { type: Number, required: true },
    details: { type: String },
    dimensions: { type: String },
    images: { type: [String], default: [] },
    overview: { type: String },
    amenities: { type: [String], default: [] },
    locationMap: { type: String },
    bedroom: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },
    kitchen: { type: Number, default: 0 },
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
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available"
    },
    soldDate: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationNote: String,
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    autoIndex: false,
  }
);

propertySchema.pre("save", async function (next) {
  try {
    if (!this.overview) {
      this.overview = `${this.bhk} BHK ${this.type} for ${this.saleOrRent} in ${this.location}`;
    }

    if (!this.dimensions) {
      this.dimensions = `${this.sqft} sq.ft`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
