"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/admin", admin_routes_1.default);
app.get("/health-check", (req, res) => {
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const healthcheck = {
        service: "Admin Service",
        message: "Admin server is Healthy ✅",
        branchName: "main",
        timestamp: new Date().toLocaleString(),
        uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    };
    try {
        res.send(healthcheck);
    }
    catch (error) {
        healthcheck.message = String(error);
        res.status(503).send();
    }
});
exports.default = app;
