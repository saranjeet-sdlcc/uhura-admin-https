import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },  
    role: {
      type: String,
      required: true,
      enum: ["owner", "admin", "service", "billing", "readonly"],
    },
    createdBy: { type: String, default: "system" },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
