import { apiClient } from "../client";
import type {
  EcosystemTrendApiResponse,
  TrendKeywordsResponse,
} from "@/types/trends";

export const TREND_QUERY_KEYS = {
  keywords: ["trends", "keywords"] as const,
  ecosystem: (params: { q: string }) => ["trends", "ecosystem", params.q] as const,
};

export const trendsEndpoints = {
  /** GET /trends/keywords — Stack Overflow 최근 7일 활동량 기준 인기 키워드 (인증 필요) */
  getTrendKeywords: (): Promise<TrendKeywordsResponse> => {
    return apiClient
      .get<TrendKeywordsResponse>("/trends/keywords")
      .then((r) => r.data);
  },

  /** 생태계 트렌드 — 부트캠퍼·테카·데브이벤트 통합 목록 */
  getEcosystemTrends: (params?: {
    category?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }): Promise<EcosystemTrendApiResponse> => {
    return apiClient
      .get<EcosystemTrendApiResponse>("/trends/ecosystem", { params })
      .then((r) => r.data);
  },
};
