const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the index doesn't exist, just continue
    if (!error.message.includes("index not found")) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
