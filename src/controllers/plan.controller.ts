import axios from "axios";
import { Request, Response } from "express";
import { config } from "../config/config";
import {
  CreatePlanRequest,
  UpdatePlanRequest,
} from "../interfaces/plan.interface";
import { logActivity } from "../utils/auditLogger";

// 1. Create Plan
export const createPlan = async (req: Request, res: Response) => {
  try {
    const planData = req.body as CreatePlanRequest;

    // Proxy to User Service: POST /plans
    const response = await axios.post(
      `${config.services.user}/plans`,
      planData
    );
    await logActivity(
      req,
      "CREATE_SUBSCRIPTION_PLAN",
      response.data.planId,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error: any) {
    console.error("Error creating plan:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Failed to create plan" };
    res.status(status).json(data);
  }
};

// 2. Update Plan
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const updates = req.body as UpdatePlanRequest;

    // Proxy to User Service: PUT /plans/:planId
    const response = await axios.put(
      `${config.services.user}/plans/${planId}`,
      updates
    );

     await logActivity(
      req,
      "UPDATE_SUBSCRIPTION_PLAN",
      response.data.planId,
      req.body
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(`Error updating plan ${req.params.planId}:`, error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Failed to update plan" };
    res.status(status).json(data);
  }
};

// 3. Get All Plans
export const getPlans = async (req: Request, res: Response) => {
  try {
    console.log("Runningaaaa !!!!!");

    const response = await axios.get(`${config.services.user}/plans`, {
      params: { isAdmin: "true" },
    });

    // console.log("Getting all plans from user service: ", response.data);

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching plans:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Failed to fetch plans" };
    res.status(status).json(data);
  }
};
