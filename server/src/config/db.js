import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. API submissions will use in-memory storage.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.warn("Continuing with in-memory storage for local testing.");
    return false;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
