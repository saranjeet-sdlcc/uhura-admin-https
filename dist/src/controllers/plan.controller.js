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
exports.getPlans = exports.updatePlan = exports.createPlan = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
// 1. Create Plan
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const planData = req.body;
        // Proxy to User Service: POST /plans
        const response = yield axios_1.default.post(`https://uhura-gateaway.azure-api.net/user/plans`, planData);
        // console.log("--------------> --------->", response);
        res.status(201).json(response.data);
    }
    catch (error) {
        console.error("Error creating plan:", error);
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        const data = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || { message: "Failed to create plan" };
        res.status(status).json(data);
    }
});
exports.createPlan = createPlan;
// 2. Update Plan
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { planId } = req.params;
        const updates = req.body;
        // Proxy to User Service: PUT /plans/:planId
        const response = yield axios_1.default.put(`${config_1.config.services.user}/plans/${planId}`, updates);
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error(`Error updating plan ${req.params.planId}:`, error.message);
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        const data = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || { message: "Failed to update plan" };
        res.status(status).json(data);
    }
});
exports.updatePlan = updatePlan;
// 3. Get All Plans
const getPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("Runningaaaa !!!!!");
        const response = yield axios_1.default.get(`${config_1.config.services.user}/plans`, {
            params: { isAdmin: "true" }
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error fetching plans:", error.message);
        const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
        const data = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || { message: "Failed to fetch plans" };
        res.status(status).json(data);
    }
});
exports.getPlans = getPlans;
