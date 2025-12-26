import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  admin?: {
    role: string;
    isAdmin: boolean;
  };
}

// 1. Basic Auth Check (Is the user logged in?)
export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.admin = decoded; // Attach role to request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// 2. Role Check (Is the user allowed to do this?)
// Usage: router.delete('/user/:id', requireRole(['owner']), deleteUser);
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Access Denied: Requires one of [${allowedRoles.join(", ")}]` 
      });
    }
    
    next();
  };
};