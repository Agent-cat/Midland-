const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["flats", "houses", "villas", "shops", "agriculture land", "residential land", "farmhouse"],
      required: true,
    },
    location: {
      type: String,
      enum: ["vijayawada", "amravathi", "guntur"],
      required: true,
    },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "sold", "rented", "pending"],
      default: "pending"
    },
    images: { type: [String], required: true },
    videos: { type: [String], default: [] },
    
    // Optional fields based on property type
    bhk: { 
      type: Number, 
      required: function() {
        return ["flats", "houses", "villas", "farmhouse"].includes(this.type);
      }
    },
    sqft: { 
      type: Number,
      required: function() {
        return ["flats", "houses", "villas", "shops", "residential land"].includes(this.type);
      }
    },
    acres: {
      type: Number,
      required: function() {
        return ["agriculture land", "farmhouse"].includes(this.type);
      }
    },
    bedroom: { type: Number },
    bathroom: { type: Number },
    kitchen: { type: Number },
    floors: { type: Number },
    washroom: { type: Number },
    soil_type: { 
      type: String,
      required: function() {
        return this.type === "agriculture land";
      }
    },
    water_source: { type: String },
    facing: { type: String },
    dimensions: { type: String },
    amenities: { type: [String], default: [] },
    overview: { type: String },
    details: { type: String },
    locationMap: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationNote: String,
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    saleOrRent: {
      type: String,
      enum: ["sale", "rent"],
      required: true
    }
  },
  {
    timestamps: true
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
