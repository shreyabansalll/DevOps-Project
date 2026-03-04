const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri || typeof uri !== "string") {
    console.error(
      "FATAL: MongoDB connection string is missing. Set MONGO_URI in your environment (e.g. .env)."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
