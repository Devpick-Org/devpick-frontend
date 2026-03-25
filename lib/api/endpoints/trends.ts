import type { TrendKeywordsResponse } from "@/types/trends";
import { mockGetTrendKeywords } from "@/lib/mock/trends";

// TODO: 실제 API 연동 시 아래 import를 활성화하고 각 함수 내부를 교체
// import { apiClient } from "../client";

export const TREND_QUERY_KEYS = {
  keywords: ["trends", "keywords"] as const,
};

export const trendsEndpoints = {
  /**
   * GET /trends/keywords — Stack Overflow 최근 7일 활동량 기준 인기 키워드 (인증 필요)
   * 실제 API 연동 시: mock 블록 제거 후 `return apiClient.get<TrendKeywordsResponse>("/trends/keywords").then((r) => r.data)` 로 교체
   */
  getTrendKeywords: (): Promise<TrendKeywordsResponse> => {
    return mockGetTrendKeywords();
  },
};
