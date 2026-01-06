import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    staffId: { type: String, required: true, index: true }, 
    staffName: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true }, 
    targetId: { type: String, index: true }, 
    details: { type: Object }, 
    ipAddress: { type: String },
    userAgent: { type: String }, // NEW: Browser/System info
    method: { type: String },    // NEW: GET, POST, PUT, DELETE
    endpoint: { type: String },  // NEW: The actual API path
  },
  { timestamps: true }
);

// Index for fast searching by the Owner
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);