import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { role, password } = req.body;

    // 1. Normalize role string (ensure lowercase for comparison)
    const selectedRole = role.toLowerCase();

    // 2. Check if role exists in our config
    const validPassword =
      config.adminCredentials[
        selectedRole as keyof typeof config.adminCredentials
      ];
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // 3. Verify Password
    if (password !== validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 4. Generate JWT with the Role embedded
    const token = jwt.sign(
      {
        role: selectedRole,
        isAdmin: true, // Marker to distinguish from normal app users
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    // 5. Return Token and Role info
    res.status(200).json({
      success: true,
      message: `Welcome back, ${role}`,
      token,
      role: selectedRole,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
