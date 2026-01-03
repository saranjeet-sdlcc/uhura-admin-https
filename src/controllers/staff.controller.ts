import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model";
import { v4 as uuidv4 } from "uuid";

// 1. Create Staff Account
export const createStaffAccount = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await Admin.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Admin({
      userId: uuidv4(), // Generate unique ID
      username,
      password: hashedPassword,
      role,
      createdBy: (req as any).user.role,
    });

    await newStaff.save();
    res
      .status(201)
      .json({
        success: true,
        data: { userId: newStaff.userId, username, role },
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating staff account" });
  }
};

// 2. Get All Staff
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    // Return custom userId instead of _id
    const staff = await Admin.find({ role: { $ne: "owner" } }).select(
      "userId username role -_id"
    );
    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff list" });
  }
};

// 3. Delete Staff Account
export const deleteStaffAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Use userId from URL
    const result = await Admin.findOneAndDelete({ userId });

    if (!result) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, message: "Staff account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account" });
  }
};

// 4. Reset Password
export const resetStaffPassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await Admin.findOneAndUpdate(
      { userId },
      { password: hashedPassword }
    );

    if (!result) return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
};
