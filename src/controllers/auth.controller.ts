import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model";
import { config } from "../config/config";
import { logActivity } from "../utils/auditLogger";
import { AuthRequest } from "../middleware/authMiddleware";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Missing credentials or role" });
    }

    // 1. Find the admin user in the DB by username and role
    // We normalize the role to lowercase for consistency
    const adminUser = await Admin.findOne({
      username,
      role: role.toLowerCase(),
    });

    if (!adminUser) {
      return res.status(401).json({ message: "Invalid username or role" });
    }

    // 2. Verify Password using bcrypt
    // Compare the plain text password from req.body with the hashed password in DB
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Generate JWT with Identity Info
    // Crucial: We include the UUID (userId) so Audit Logs know exactly who made the change
    const token = jwt.sign(
      {
        userId: adminUser.userId, // This is your secure UUID
        username: adminUser.username,
        role: adminUser.role,
        isAdmin: true,
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    await logActivity(req as AuthRequest, "LOGIN", adminUser.userId, {
      userId: adminUser.userId,
      username: adminUser.username,
      role: adminUser.role,
    });

    // 4. Return Token and User info
    res.status(200).json({
      success: true,
      message: `Welcome back, ${adminUser.username}`,
      token,
      user: {
        userId: adminUser.userId,
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
