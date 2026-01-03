import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../src/models/Admin.model";
import dotenv from "dotenv";

dotenv.config();

const seedOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    
    const hashedPassword = await bcrypt.hash("owner123", 10);
    
    const owner = new Admin({
      username: "superowner",
      password: hashedPassword,
      role: "owner",
      createdBy: "system"
    });

    await owner.save();
    console.log("✅ Super Owner created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding owner:", error);
    process.exit(1);
  }
};

seedOwner();