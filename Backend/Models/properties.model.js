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
    area: {
      value: {
        type: Number,
        required: function() {
          return ["agriculture land", "farmhouse", "residential land"].includes(this.type);
        }
      },
      unit: {
        type: String,
        enum: ["sq.yard", "sq.m", "acres", "marla", "cents", "bigha", "kottah", "kanal", "grounds", "ares", "biswa", "guntha", "aankadam", "hectares", "rood", "chataks", "perch"],
        required: function() {
          return ["agriculture land", "farmhouse", "residential land"].includes(this.type);
        }
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
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      unit: {
        type: String,
        enum: ["feet", "meters"],
        default: "feet"
      }
    },
    carpetArea: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ["sq.ft", "sq.yard", "sq.m"],
        default: "sq.ft"
      }
    },
    builtUpArea: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ["sq.ft", "sq.yard", "sq.m"],
        default: "sq.ft"
      }
    },
    furnishingStatus: {
      type: String,
      enum: ["furnished", "unfurnished", "semi-furnished"],
      required: function() {
        return ["flats", "houses", "villas", "shops"].includes(this.type);
      }
    },
    flooring: {
      type: String,
      enum: ["tiled", "marbled"],
      required: function() {
        return ["flats", "houses", "villas", "shops"].includes(this.type);
      }
    },
    hasBoundaryWall: {
      type: Boolean,
      default: false
    },
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
    },
    propertyCategory: {
      type: String,
      enum: ["residential", "commercial"],
      required: true
    },
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
      this.dimensions = `${this.bhk} BHK`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
