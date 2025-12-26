import axios from "axios";
import { Request, Response } from "express";
import { config } from "../config/config";
import {
  CallStats,
  ChatStats,
  UserGrowthResponse,
  UserStats,
} from "../interfaces/stats.interface";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Fire off all requests in paral`lel
    const results = await Promise.allSettled([
      axios.get<UserStats>(`${config.services.user}/stats/total-users`),
      axios.get<ChatStats>(`${config.services.chat}/stats/total-messages`),
      axios.get<CallStats>(`${config.services.call}/stats/total-calls`),
      axios.get<UserGrowthResponse>(`${config.services.auth}/stats/growth`),
    ]);

    const userResult = results[0];
    const chatResult = results[1];
    const callResult = results[2];
    const growthResult = results[3];


    // Helper to extract data if request succeeded, or return null if failed
    const getData = <T>(
      result: PromiseSettledResult<{ data: T }>
    ): T | null => {
      return result.status === "fulfilled" ? result.value.data : null;
    };

    const userData = getData<UserStats>(userResult);
    const chatData = getData<ChatStats>(chatResult);
    const callData = getData<CallStats>(callResult);
    const growthDataResponse = getData<UserGrowthResponse>(growthResult);

    // console.log("All 7 days users data : ", growthDataResponse);

    res.json({
      overview: {
        totalUsers: userData?.totalUsers ?? 0,

        totalMessages: {
          allTime: chatData?.totalMessages ?? 0,
          today: chatData?.messagesToday ?? 0,
        },

        totalCalls: {
          allTime: callData?.totalCalls ?? 0,
          today: callData?.callsToday ?? 0,
        },

        growthData: growthDataResponse?.data || [],
      },
      serviceStatus: {
        user: userResult.status === "fulfilled" ? "online" : "offline",
        chat: chatResult.status === "fulfilled" ? "online" : "offline",
        call: callResult.status === "fulfilled" ? "online" : "offline",
        auth: growthResult.status === "fulfilled" ? "online" : "offline",
      },
    });
  } catch (error) {
    console.error("Critical Aggregation Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
