import { AuthRequest } from "../middleware/authMiddleware";
import { AuditLog } from "../models/AuditLog.model";
 
export const logActivity = async (
  req: AuthRequest,
  action: string,
  targetId?: string,
  details?: any
) => {
  try {
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const clientIp = Array.isArray(rawIp) ? rawIp[0] : rawIp;

    const staffId = req.admin?.userId || details?.userId || "SYSTEM";
    const staffName = req.admin?.username || details?.username || "SYSTEM_EVENT";
    const role = req.admin?.role || details?.role || "N/A";

    const cleanDetails = { ...details };
    if (!req.admin) {
        delete cleanDetails.userId;
        delete cleanDetails.username;
        delete cleanDetails.role;
    }

    await AuditLog.create({
      staffId,
      staffName,
      role,
      action: action.toUpperCase(),
      targetId: targetId || "N/A",
      details: cleanDetails,
      ipAddress: String(clientIp),
      userAgent: req.headers["user-agent"] || "unknown",
      method: req.method,
      endpoint: req.originalUrl,
    });

  } catch (error) {
    console.error("🚨 Critical: Audit Log Failed to Save:", error);
  }
};