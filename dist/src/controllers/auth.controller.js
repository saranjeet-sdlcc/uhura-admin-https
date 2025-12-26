"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, password } = req.body;
        // 1. Normalize role string (ensure lowercase for comparison)
        const selectedRole = role.toLowerCase();
        // 2. Check if role exists in our config
        const validPassword = config_1.config.adminCredentials[selectedRole];
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid role selected" });
        }
        // 3. Verify Password
        if (password !== validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // 4. Generate JWT with the Role embedded
        const token = jsonwebtoken_1.default.sign({
            role: selectedRole,
            isAdmin: true // Marker to distinguish from normal app users
        }, config_1.config.jwtSecret, { expiresIn: "24h" });
        // 5. Return Token and Role info
        res.status(200).json({
            success: true,
            message: `Welcome back, ${role}`,
            token,
            role: selectedRole
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.adminLogin = adminLogin;
