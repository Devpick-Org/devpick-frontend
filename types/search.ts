export type TrendRange = "day" | "week" | "month";

export interface TrendTopPost {
  rank: number;
  id: string;
  title: string;
  sourceName: string;
  tags: string[];
  viewCount: number;
  thumbnailUrl: string | null;
  category: string;
  /** 전 기간 대비 조회수 증감률 (%). 양수: 증가, 음수: 감소, 0: 변화 없음 */
  changeRate: number;
}

export interface TrendKeywordItem {
  keyword: string;
  rank: number;
}

export interface HomeTrendData {
  dateLabel: string;
  topPosts: TrendTopPost[];
  /** day 범위에서는 빈 문자열 (섹션 자체를 숨김) */
  topPostsSummary: string;
  /** day 범위에서는 빈 문자열 (섹션 자체를 숨김) */
  collectionSummary: string;
  trendingKeywords: TrendKeywordItem[];
}
