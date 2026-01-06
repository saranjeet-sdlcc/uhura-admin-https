import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AuditLog } from "../models/AuditLog.model";

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { staffName, action } = req.query;

    const filter: any = {};
    if (staffName) filter.staffName = { $regex: staffName, $options: "i" };
    if (action) filter.action = action;

    const skip = (page - 1) * limit;

    // 3. Fetch logs and total count in parallel for speed
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 }) // Newest actions first
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};