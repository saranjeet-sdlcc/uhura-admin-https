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
exports.getUserDetails = exports.getUsers = exports.getUserGrowthStats = exports.getReports = exports.updateUserStatus = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId } = req.params;
        const { status, banDurationInDays, reason } = req.body;
        const response = yield axios_1.default.put(`${config_1.config.services.user}/v1/user/admin/status/${userId}`, {
            status,
            banDurationInDays,
            reason,
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error updating user status:", error.message);
        res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
            message: "Failed to update status",
            error: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
        });
    }
});
exports.updateUserStatus = updateUserStatus;
const getReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { page, limit, status } = req.query;
        const response = yield axios_1.default.get(`${config_1.config.services.user}/v1/user/admin/reports`, {
            params: { page, limit, status },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching reports:", error.message);
        res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
            message: "Failed to fetch reports",
            error: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
        });
    }
});
exports.getReports = getReports;
const getUserGrowthStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.get(`${config_1.config.services.user}/stats/growth`);
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching user growth stats:", error.message);
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        const data = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || {
            message: "Failed to fetch growth stats",
        };
        res.status(status).json(data);
    }
});
exports.getUserGrowthStats = getUserGrowthStats;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // 1. Extract Query Params (page, limit, search) from Frontend request
        const { page, limit, search } = req.query;
        const url = `${config_1.config.services.user}/v1/user/admin/users`;
        // const url = `http://localhost:4001/api/v1/user/admin/users`;
        const response = yield axios_1.default.get(url, {
            params: { page, limit, search }, // Forward params automatically
        });
        // 3. Return data to Frontend
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching users from User Service:", error.message);
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        const data = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || { message: "Internal Server Error" };
        res.status(status).json(data);
    }
});
exports.getUsers = getUsers;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userUrl = `${config_1.config.services.user}/v1/user/admin/users/${userId}`;
        // TODO: Check Chat and Call Service URLs
        const chatUrl = `${config_1.config.services.chat}/stats/user/${userId}`;
        const callUrl = `${config_1.config.services.call}/stats/user/${userId}`;
        const [userRes, chatRes, callRes] = yield Promise.allSettled([
            axios_1.default.get(userUrl),
            axios_1.default.get(chatUrl),
            axios_1.default.get(callUrl),
        ]);
        if (userRes.status === "rejected") {
            console.error("User Service Failed:", userRes.reason.message);
            return res
                .status(404)
                .json({ message: "User not found or User Service down" });
        }
        const userData = userRes.value.data.data;
        // console.log("User userData:", userData);
        const totalMessages = chatRes.status === "fulfilled" ? chatRes.value.data.totalMessages : 0;
        const totalCalls = callRes.status === "fulfilled" ? callRes.value.data.totalCalls : 0;
        const isHighUsage = totalMessages > 1000 || totalCalls > 500;
        const formattedData = {
            id: userData.userId,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            phone: userData.phone,
            status: userData.profileStatus,
            accountType: "Personal",
            joinDate: userData.createdAt,
            lastLogin: userData.lastLogin,
            profilePic: userData.profilePicUrl,
            highUsage: isHighUsage,
            totalCalls: totalCalls,
            totalMessages: totalMessages,
        };
        return res.status(200).json({ success: true, data: formattedData });
    }
    catch (error) {
        console.error("Error aggregating user details:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUserDetails = getUserDetails;
