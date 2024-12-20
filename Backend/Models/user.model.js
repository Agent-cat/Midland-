const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phno: {
      type: Number,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://imgs.search.brave.com/jm5UP6r8PnjZnT5e-qJcZH4eSpg922A4sc4UqCQoz5c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvZGVmYXVsdC11/c2VyLXByb2ZpbGUt/dmVjdG9yLWlsbHVz/dHJhdGlvbl82NjQ5/OTUtMzM0LmpwZz9z/aXplPTYyNiZleHQ9/anBn",
    },
    role: {
      type: String,
      enum: ["admin", "client", "agent"],
      default: "client",
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    recentlyViewed: {
      type: Array,
      default: [],
    },
    cart: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
      ],
      default: [],
    },
    subscription: {
      plan: {
        type: String,
        enum: ["none", "pro", "premium"],
        default: "none",
      },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "expired",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
