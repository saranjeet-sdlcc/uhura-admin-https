import axios from "axios";
import { Request, Response } from "express";
import { config } from "../config/config";
import { UpdateStatusRequest } from "../interfaces/stats.interface";
import { AuditLog } from "../models/AuditLog.model";
import { AuthRequest } from "../middleware/authMiddleware";
import { logActivity } from "../utils/auditLogger";

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try { 
    const { userId } = req.params;
    const { status, banDurationInDays, reason } =
      req.body as UpdateStatusRequest;

    const response = await axios.put(
      `${config.services.user}/v1/user/admin/status/${userId}`,
      { 
        status,
        banDurationInDays,
        reason,
      }
    );

    await logActivity(req, "USER_STATUS_UPDATE", userId, {
      status,
      reason,
      banDurationInDays,
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error updating user status:", error.message);
    res.status(error.response?.status || 500).json({
      message: "Failed to update status",
      error: error.response?.data,
    });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query;

    const response = await axios.get(
      `${config.services.user}/v1/user/admin/reports`,
      {
        params: { page, limit, status },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching reports:", error.message);
    res.status(error.response?.status || 500).json({
      message: "Failed to fetch reports",
      error: error.response?.data,
    });
  }
};

export const getUserGrowthStats = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${config.services.user}/stats/growth`);

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching user growth stats:", error.message);

    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Failed to fetch growth stats",
    };

    res.status(status).json(data);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, search } = req.query;

    const url = `${config.services.user}/v1/user/admin/users`;

    const response = await axios.get(url, {
      params: { page, limit, search },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching users from User Service:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Internal Server Error" };
    res.status(status).json(data);
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userUrl = `${config.services.user}/v1/user/admin/users/${userId}`;

    // TODO: Check Chat and Call Service URLs
    const chatUrl = `${config.services.chat}/stats/user/${userId}`;

    const callUrl = `${config.services.call}/stats/user/${userId}`;

    const [userRes, chatRes, callRes] = await Promise.allSettled([
      axios.get(userUrl),
      axios.get(chatUrl),
      axios.get(callUrl),
    ]);

    if (userRes.status === "rejected") {
      console.error("User Service Failed:", userRes.reason.message);
      return res
        .status(404)
        .json({ message: "User not found or User Service down" });
    }

    const userData = userRes.value.data.data;

    const totalMessages =
      chatRes.status === "fulfilled" ? chatRes.value.data.totalMessages : 0;
    const totalCalls =
      callRes.status === "fulfilled" ? callRes.value.data.totalCalls : 0;

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
  } catch (error: any) {
    console.error("Error aggregating user details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
