import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middleware/authMiddleware";
import { logActivity } from "../utils/auditLogger";

// 1. Create Staff Account
export const createStaffAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await Admin.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Admin({
      userId: uuidv4(),             
      username,
      password: hashedPassword,
      role,
      createdBy: req.admin?.username || "owner",
    });

    await newStaff.save();

    await logActivity(req, "STAFF_CREATED", String(newStaff.userId), {
      newStaffUsername: username, 
      assignedRole: role,
    });

    res.status(201).json({
      success: true,
      data: { userId: newStaff.userId, username, role },
    });
  } catch (error) {
    console.log("Error in creating staff memeber: ", error);

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
    const { id } = req.params; // Use userId from URL
    const result = await Admin.findOneAndDelete({ id });

    if (!result) return res.status(404).json({ message: "User not found" });

    await logActivity(req, "STAFF_DELETED", String(id), {
      deletedUsername: result.username,
      deletedRole: result.role,
    });

    res.status(200).json({ success: true, message: "Staff account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account" });
  }
};

export const resetStaffPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body; 

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Use the variable 'id' here
    const adminUser = await Admin.findOne({ userId: id });

    if (!adminUser) {
      console.log(`❌ DEBUG: User with UUID ${id} not found in DB`);
      return res.status(404).json({ message: "Staff member not found" });
    }

    const oldHash = adminUser.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    adminUser.password = hashedPassword;
    const updatedUser = await adminUser.save();

    await logActivity(req, "STAFF_PASSWORD_RESET", id, {
      targetUsername: updatedUser.username,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Error updating password" });
  }
};
