// user stats
export interface UserStats {
  totalUsers: number;
  growthHistory: Array<{ date: string; count: number }>; // 👈 New Field
}

// chat stats
export interface ChatStats {
  totalMessages: number;
  messagesToday: number;
}

// call stats
export interface CallStats {
  totalCalls: number;
  callsToday: number;
}

// last 7 days growth data point
export interface GrowthDataPoint {
  date: string;
  count: number;
}

export interface UserGrowthResponse {
  success: boolean;
  data: GrowthDataPoint[];
}

// update user report status
export interface UpdateStatusRequest {
  userId: string;
  status: "Active" | "Suspended" | "Banned";
  banDurationInDays?: number; // Optional: 7, 30, etc.
  reason?: string;
}

// dashboard response
export interface DashboardResponse {
  users: number | null;
  messages: number | null;
  calls: number | null;
  status: "partial" | "success" | "error";
}

// a to z User Details Response
export interface UserDetailResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  accountType: string;
  joinDate: string;
  lastLogin: string;
  profilePic: string | null;
  highUsage: boolean;
  totalCalls: number;
  totalMessages: number;
}
