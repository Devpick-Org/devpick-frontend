import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type { HomeTrendData, TrendRange } from "@/types/search";

export const SEARCH_QUERY_KEYS = {
  trendAnalysis: (unit: TrendRange) => ["trends", "analysis", unit] as const,
};

export const searchEndpoints = {
  getTrendAnalysis: (
    unit: TrendRange,
    scope: string = "global",
  ): Promise<HomeTrendData> => {
    return apiClient
      .get<ApiResponse<HomeTrendData>>("/trends/analysis", {
        params: { unit, scope },
      })
      .then((r) => r.data.data);
  },
};
