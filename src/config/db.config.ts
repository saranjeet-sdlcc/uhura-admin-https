import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(
      `✅ Admin Service Connected to MongoDB: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${String(error)}`);
    process.exit(1);  
  }
};
