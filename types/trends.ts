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
