const asyncHandler = require("express-async-handler");
const User = require("../Models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Add this new function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Add this new function to send OTP
const sendOTP = async (phone, otp) => {
  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}/MIDLAND`
    );
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

// Add this new endpoint to send OTP
const sendRegistrationOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  try {
    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Phone number must be 10 digits",
      });
    }

    // Check if phone number already exists
    const phoneExist = await User.findOne({ phno: phone });
    if (phoneExist) {
      return res.status(409).json({
        error: "Phone number already registered",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in session/cache (you might want to use Redis in production)
    // For now, we'll store it in memory
    if (!global.otpStore) global.otpStore = new Map();
    global.otpStore.set(phone, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Send OTP
    await sendOTP(phone, otp);

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      error: "Failed to send OTP",
      details: error.message,
    });
  }
});

// Add this new endpoint to verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  try {
    if (!global.otpStore || !global.otpStore.has(phone)) {
      return res.status(400).json({
        error: "No OTP request found",
      });
    }

    const otpData = global.otpStore.get(phone);
    
    // Check if OTP is expired (5 minutes)
    if (Date.now() - otpData.timestamp > 5 * 60 * 1000) {
      global.otpStore.delete(phone);
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    // Check if too many attempts
    if (otpData.attempts >= 3) {
      global.otpStore.delete(phone);
      return res.status(400).json({
        error: "Too many attempts. Please request new OTP",
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts++;
      global.otpStore.set(phone, otpData);
      return res.status(400).json({
        error: "Invalid OTP",
        attemptsLeft: 3 - otpData.attempts
      });
    }

    // OTP verified successfully
    global.otpStore.delete(phone);
    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      error: "Failed to verify OTP",
      details: error.message,
    });
  }
});

// Modify the existing signup function
const signup = asyncHandler(async (req, res) => {
  const { username, email, password, phno, role, isLoggedIn, profilePicture, otp } = req.body;

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

    // Verify OTP before creating user
    if (!global.otpStore || !global.otpStore.has(phno)) {
      return res.status(400).json({
        error: "Please verify your phone number first",
      });
    }

    const otpData = global.otpStore.get(phno);
    if (otpData.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
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

    // Clear OTP data after successful signup
    global.otpStore.delete(phno);

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

module.exports = { 
  signup, 
  signin, 
  getusers, 
  sendRegistrationOTP, 
  verifyOTP 
};
