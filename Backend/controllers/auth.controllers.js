const asyncHandler = require("express-async-handler");
const User = require("../Models/user.model.js");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = asyncHandler(async (req, res) => {
  const { username, email, password, phno, role, isLoggedIn, profilePicture } =
    req.body;

  try {
    // Input validation
    if (!username || !email || !password || !phno) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          username: !username ? "Username is required" : null,
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
          phno: !phno ? "Phone number is required" : null,
        },
      });
    }

    // Check for existing username
    try {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(409).json({
          error: "Username is already taken",
          field: "username",
        });
      }
    } catch (error) {
      console.error("Username check error:", error);
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phno)) {
      return res.status(400).json({
        error: "Phone number must be 10 digits",
      });
    }

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const phoneExist = await User.findOne({ phno });
    if (phoneExist) {
      return res.status(409).json({
        error: "Phone number already registered",
      });
    }

    // Create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phno,
      role: role || "client",
      isLoggedIn: false,
      profilePicture: profilePicture || "",
    });

    if (user) {
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(201).json({
        _id: user._id,
        name: user.username,
        email: user.email,
        pic: user.profilePicture,
        token: token,
      });
    }
  } catch (error) {
    console.error("Signup error:", error);

    // Check for duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = "";

      switch (field) {
        case "username":
          errorMessage = "Username is already taken";
          break;
        case "email":
          errorMessage = "Email is already registered";
          break;
        case "phno":
          errorMessage = "Phone number is already registered";
          break;
        default:
          errorMessage = "Duplicate field value entered";
      }

      return res.status(409).json({
        error: errorMessage,
        field: field,
      });
    }

    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
});

const signin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
        },
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Account not found with this email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      _id: user._id,
      name: user.username,
      email: user.email,
      pic: user.profilePicture,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
});

const getusers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
});

module.exports = { signup, signin, getusers };
