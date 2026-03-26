// db.ts (or mongoose.ts)
import mongoose from "mongoose";

export const connectDB = () => {
  const DBURL = process.env.DB_URL;

  if (!DBURL) {
    console.error("ERROR: DB_URL is not defined in environment variables!");
    console.error(
      "Please create a .env file with: DB_URL=your_mongodb_connection_string"
    );
    process.exit(1);
  }

  console.log("Environment variables loaded:");
  console.log("DB_URL exists:", !!process.env.DB_URL);
  console.log("DB_URL value:", process.env.DB_URL);

  mongoose
    .connect(DBURL, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTryOnce: false, // Retry server selection
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err.message);
      console.error("Please check your MongoDB connection string in .env file");
      console.error(
        "Make sure MongoDB is running and the connection string is correct"
      );
      process.exit(1);
    });
};

export default connectDB;
