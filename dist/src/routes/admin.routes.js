"use strict";
// import { Router } from "express";
// import { getDashboardStats } from "../controllers/dashboard.controller";
// import {
//   getReports,
//   getUserDetails,
//   getUserGrowthStats,
//   getUsers,
//   updateUserStatus,
// } from "../controllers/user.controller";
// import {
//   createPlan,
//   getPlans,
//   updatePlan,
// } from "../controllers/plan.controller";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get("/dashboard", getDashboardStats);
// // for Banning/Unbanning users
// router.put("/users/:userId/status", updateUserStatus);
// // get all reported users
// router.get("/reports", getReports);
// // jan-dec users growth
// router.get("/stats/growth", getUserGrowthStats);
// router.post("/plans", createPlan);
// router.put("/plans/:planId", updatePlan);
// router.get("/plans", getPlans);
// // /admin/users?page=1&limit=10
// router.get("/users", getUsers);
// // get Single User Details
// router.get("/users/:userId", getUserDetails);
// export default router;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller"); // Import Login Controller
const authMiddleware_1 = require("../middleware/authMiddleware"); // Import Middleware
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const user_controller_1 = require("../controllers/user.controller");
const plan_controller_1 = require("../controllers/plan.controller");
const router = (0, express_1.Router)();
// --- PUBLIC ROUTES ---
router.post("/login", auth_controller_1.adminLogin);
// --- PROTECTED ROUTES ---
// 1. Dashboard
// Access: All Roles (Owner, Admin, Service, Billing, Read-only) [cite: 416]
router.get("/dashboard", authMiddleware_1.verifyAdmin, dashboard_controller_1.getDashboardStats);
// 2. User Management
// Get All Users: All Roles [cite: 418]
router.get("/users", authMiddleware_1.verifyAdmin, user_controller_1.getUsers);
// Get Single User: All Roles [cite: 418]
router.get("/users/:userId", authMiddleware_1.verifyAdmin, user_controller_1.getUserDetails);
// Ban/Unban/Suspend User
// Access: Owner, Admin, Service [cite: 418]
router.put("/users/:userId/status", authMiddleware_1.verifyAdmin, (0, authMiddleware_1.requireRole)(["owner", "admin", "service"]), user_controller_1.updateUserStatus);
// 3. Analytics (User Growth)
// Access: All Roles [cite: 426]
router.get("/stats/growth", authMiddleware_1.verifyAdmin, user_controller_1.getUserGrowthStats);
// 4. Content Moderation (Reports)
// Access: Owner, Admin, Service, Read-only (Billing excluded) [cite: 420]
router.get("/reports", authMiddleware_1.verifyAdmin, (0, authMiddleware_1.requireRole)(["owner", "admin", "service", "readonly"]), user_controller_1.getReports);
// 5. Billing Management (Plans)
// Create Plan
// Access: Owner, Billing [cite: 422]
router.post("/plans", authMiddleware_1.verifyAdmin, (0, authMiddleware_1.requireRole)(["owner", "billing"]), plan_controller_1.createPlan);
// Update Plan
// Access: Owner, Billing [cite: 422]
router.put("/plans/:planId", authMiddleware_1.verifyAdmin, (0, authMiddleware_1.requireRole)(["owner", "billing"]), plan_controller_1.updatePlan);
// Get Plans
// Access: Owner, Admin, Billing, Read-only (Service excluded) [cite: 422]
router.get("/plans", authMiddleware_1.verifyAdmin, (0, authMiddleware_1.requireRole)(["owner", "admin", "billing", "readonly"]), plan_controller_1.getPlans);
exports.default = router;
