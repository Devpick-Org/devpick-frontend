import type { ApiResponse } from "./api";

export interface TrendKeywordsData {
  keywords: string[];
  updatedAt: string;
}

export type TrendKeywordsResponse = ApiResponse<TrendKeywordsData>;

/** rank에 따른 버블 크기 티어 */
export type KeywordTier = "top" | "large" | "medium" | "small";

/** 화면 렌더링용 가공 타입 */
export interface RankedKeyword {
  keyword: string;
  rank: number;
  tier: KeywordTier;
}

/** 부트캠퍼·테카·데브이벤트 통합 카드 */
export type EcosystemTrendCategory = "bootcamp" | "club" | "event";

export interface EcosystemTrendItemDto {
  id: string;
  category: EcosystemTrendCategory;
  title: string;
  organizer: string;
  thumbnailUrl?: string | null;
  detailUrl: string;
  subtitle?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  tags?: string[];
  source: string;
}

export interface EcosystemTrendPageData {
  items: EcosystemTrendItemDto[];
  total: number;
  fetchedAt: string;
  sourceCounts: Record<string, number>;
}

export type EcosystemTrendApiResponse = ApiResponse<EcosystemTrendPageData>;
