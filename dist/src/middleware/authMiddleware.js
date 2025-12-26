"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
// 1. Basic Auth Check (Is the user logged in?)
const verifyAdmin = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.admin = decoded; // Attach role to request
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
};
exports.verifyAdmin = verifyAdmin;
// 2. Role Check (Is the user allowed to do this?)
// Usage: router.delete('/user/:id', requireRole(['owner']), deleteUser);
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin || !allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({
                message: `Access Denied: Requires one of [${allowedRoles.join(", ")}]`
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
