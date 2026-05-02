export type TrendRange = "daily" | "weekly" | "monthly";

export interface TrendTopPost {
  rank: number;
  id: string;
  title: string;
  translatedTitle: string | null;
  sourceName: string;
  tags: string[];
  viewCount: number;
  thumbnailUrl: string | null;
  category: string;
  /** 전 기간 대비 조회수 증감률 (%). 양수: 증가, 음수: 감소, 0: 변화 없음 */
  changeRate: number;
  isMyInterest: boolean;
}

export type TrendKeywordState = "new" | "up" | "down" | "same";

export interface TrendKeywordItem {
  keyword: string;
  rank: number;
  count?: number;
  state: TrendKeywordState;
  rankChange: number;
  isMyInterest?: boolean;
}

export interface SearchResultItem {
  id: string;
  title: string;
  sourceName: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  summary: string;
  tags: string[];
  url: string;
}

export interface HomeTrendData {
  unit: TrendRange;
  periodStart: string;
  periodEnd: string;
  dateLabel: string;
  topPosts: TrendTopPost[];
  /** LLM 실패 시 null. 전 단위에서 null 가능 */
  topPostsSummary: string | null;
  /** LLM 실패 시 null. daily 단위에서는 항상 null */
  collectionSummary: string | null;
  /** 데이터 없으면 null (빈 배열 아님) */
  trendingTags: TrendKeywordItem[] | null;
}
