import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  admin?: {
    userId: string;   
    username: string;  
    role: string;
    isAdmin: boolean;
  };
}

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    req.admin = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      isAdmin: decoded.isAdmin
    };
    
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

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