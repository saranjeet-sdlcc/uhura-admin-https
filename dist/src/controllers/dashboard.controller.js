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
exports.getDashboardStats = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        // 1. Fire off all requests in paral`lel
        const results = yield Promise.allSettled([
            axios_1.default.get(`${config_1.config.services.user}/stats/total-users`),
            axios_1.default.get(`${config_1.config.services.chat}/stats/total-messages`),
            axios_1.default.get(`${config_1.config.services.call}/stats/total-calls`),
            axios_1.default.get(`${config_1.config.services.auth}/stats/growth`),
        ]);
        const userResult = results[0];
        const chatResult = results[1];
        const callResult = results[2];
        const growthResult = results[3];
        // Helper to extract data if request succeeded, or return null if failed
        const getData = (result) => {
            return result.status === "fulfilled" ? result.value.data : null;
        };
        const userData = getData(userResult);
        const chatData = getData(chatResult);
        const callData = getData(callResult);
        const growthDataResponse = getData(growthResult);
        // console.log("All 7 days users data : ", growthDataResponse);
        res.json({
            overview: {
                totalUsers: (_a = userData === null || userData === void 0 ? void 0 : userData.totalUsers) !== null && _a !== void 0 ? _a : 0,
                totalMessages: {
                    allTime: (_b = chatData === null || chatData === void 0 ? void 0 : chatData.totalMessages) !== null && _b !== void 0 ? _b : 0,
                    today: (_c = chatData === null || chatData === void 0 ? void 0 : chatData.messagesToday) !== null && _c !== void 0 ? _c : 0,
                },
                totalCalls: {
                    allTime: (_d = callData === null || callData === void 0 ? void 0 : callData.totalCalls) !== null && _d !== void 0 ? _d : 0,
                    today: (_e = callData === null || callData === void 0 ? void 0 : callData.callsToday) !== null && _e !== void 0 ? _e : 0,
                },
                growthData: (growthDataResponse === null || growthDataResponse === void 0 ? void 0 : growthDataResponse.data) || [],
            },
            serviceStatus: {
                user: userResult.status === "fulfilled" ? "online" : "offline",
                chat: chatResult.status === "fulfilled" ? "online" : "offline",
                call: callResult.status === "fulfilled" ? "online" : "offline",
                auth: growthResult.status === "fulfilled" ? "online" : "offline",
            },
        });
    }
    catch (error) {
        console.error("Critical Aggregation Error:", error);
        res.status(500).json({ message: "Failed to load dashboard" });
    }
});
exports.getDashboardStats = getDashboardStats;
