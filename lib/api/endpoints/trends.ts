import { apiClient } from "../client";
import type { TrendKeywordsResponse } from "@/types/trends";

export const TREND_QUERY_KEYS = {
  keywords: ["trends", "keywords"] as const,
};

export const trendsEndpoints = {
  /** GET /trends/keywords — Stack Overflow 최근 7일 활동량 기준 인기 키워드 (인증 필요) */
  getTrendKeywords: (): Promise<TrendKeywordsResponse> => {
    return apiClient
      .get<TrendKeywordsResponse>("/trends/keywords")
      .then((r) => r.data);
  },
};
