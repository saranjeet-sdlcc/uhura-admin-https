import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller"; // Import Login Controller
import { verifyAdmin, requireRole } from "../middleware/authMiddleware"; // Import Middleware
import { getDashboardStats } from "../controllers/dashboard.controller";
import {
  getReports,
  getUserDetails,
  getUserGrowthStats,
  getUsers,
  updateUserStatus,
} from "../controllers/user.controller";
import {
  createPlan,
  getPlans,
  updatePlan,
} from "../controllers/plan.controller";
import { createStaffAccount, deleteStaffAccount, getAllStaff, resetStaffPassword } from "../controllers/staff.controller";

const router = Router();

// --- PUBLIC ROUTES ---
router.post("/login", adminLogin);

// --- PROTECTED ROUTES ---

// 1. Dashboard
// Access: All Roles (Owner, Admin, Service, Billing, Read-only) [cite: 416]
router.get("/dashboard", verifyAdmin, getDashboardStats);

// 2. User Management
// Get All Users: All Roles [cite: 418]
router.get("/users", verifyAdmin, getUsers);

// Get Single User: All Roles [cite: 418]
router.get("/users/:userId", verifyAdmin, getUserDetails);

// Ban/Unban/Suspend User
// Access: Owner, Admin, Service [cite: 418]
router.put(
  "/users/:userId/status",
  verifyAdmin,
  requireRole(["owner", "admin", "service"]),
  updateUserStatus
);

// 3. Analytics (User Growth)
// Access: All Roles [cite: 426]
router.get("/stats/growth", verifyAdmin, getUserGrowthStats);

// 4. Content Moderation (Reports)
// Access: Owner, Admin, Service, Read-only (Billing excluded) [cite: 420]
router.get(
  "/reports",
  verifyAdmin,
  requireRole(["owner", "admin", "service", "readonly"]),
  getReports
);

// 5. Billing Management (Plans)
// Create Plan
// Access: Owner, Billing [cite: 422]
router.post(
  "/plans",
  verifyAdmin,
  requireRole(["owner", "billing"]),
  createPlan
);

// Update Plan
// Access: Owner, Billing [cite: 422]
router.put(
  "/plans/:planId",
  verifyAdmin,
  requireRole(["owner", "billing"]),
  updatePlan
);

// Get Plans
// Access: Owner, Admin, Billing, Read-only (Service excluded) [cite: 422]
router.get(
  "/plans",
  verifyAdmin,
  requireRole(["owner", "admin", "billing", "readonly"]),
  getPlans
);

// Create a new staff member
router.post(
  "/staff", 
  verifyAdmin, 
  requireRole(["owner"]), 
  createStaffAccount
);

// Get list of all staff members
router.get(
  "/staff", 
  verifyAdmin, 
  requireRole(["owner"]), 
  getAllStaff
);

// Delete a staff member
router.delete(
  "/staff/:id", 
  verifyAdmin, 
  requireRole(["owner"]), 
  deleteStaffAccount
);

// Update/Reset a staff member's password
router.patch(
  "/staff/:id/password", 
  verifyAdmin, 
  requireRole(["owner"]), 
  resetStaffPassword
);

export default router;