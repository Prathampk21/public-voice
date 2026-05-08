const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use reliable DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    if (!process.env.MONGO_URI) {
      console.error("MongoDB Connection Error: MONGO_URI is missing in server/.env");
      process.exit(1);
    }

    console.log(
      "MongoDB URI Loaded:",
      process.env.MONGO_URI.includes("public-voice-cluster") ? "Yes" : "No"
    );

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;