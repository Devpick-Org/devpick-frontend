import { ApiResponse } from "./api";

export type AiSummaryLevel = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";

export interface AiSummary {
  contentId: string;
  level: AiSummaryLevel;
  coreSummary: string;
  keyPoints: string[];
  keywords: string[];
  difficulty: string;
  nextRecommendation: string;
  confidence: number;
  additionalQuestions: string[];
  cachedAt: string;
  expiresAt: string;
}

export type AiSummaryResponse = ApiResponse<AiSummary>;

export interface Content {
  id: string;
  title: string;
  author: string;
  sourceName: string;
  preview: string;
  thumbnailUrl: string | null;
  canonicalUrl: string;
  tags: string[];
  publishedAt: string;
  isScrapped: boolean;
  isLiked: boolean;
}

export interface StackOverflowAnswer {
  body: string;
  score: number;
}

export interface ContentDetail extends Content {
  originalContent?: string | null;
  isOriginalVisible: boolean;
  licenseType?: string | null;
  // Stack Overflow 전용 필드 — SO 콘텐츠일 때만 존재, 아니면 undefined
  score?: number | null;
  viewCount?: number | null;
  isAnswered?: boolean | null;
  questionContent?: string | null;
  acceptedAnswer?: StackOverflowAnswer | null;
  topAnswers?: StackOverflowAnswer[] | null;
}

/**
 * Stack Overflow 전용 상세 타입.
 * SO 필드를 optional(?) 없이 required로 좁혀서 구조분해 시 undefined 배제.
 * 값 자체는 nullable(null 가능) — 백엔드가 null로 내려줄 수 있음.
 */
export interface StackOverflowContentDetail extends ContentDetail {
  score: number | null;
  viewCount: number | null;
  isAnswered: boolean | null;
  questionContent: string | null;
  acceptedAnswer: StackOverflowAnswer | null;
  topAnswers: StackOverflowAnswer[] | null;
}

/** type predicate — true 반환 시 content를 StackOverflowContentDetail로 narrowing */
export function isStackOverflowContent(
  content: ContentDetail,
): content is StackOverflowContentDetail {
  return content.sourceName.trim().toLowerCase() === "stack overflow";
}

export interface ContentFeedData {
  contents: Content[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ContentFeedResponse = ApiResponse<ContentFeedData>;
export type ContentDetailResponse = ApiResponse<ContentDetail>;
export type ContentRecommendationsResponse = ApiResponse<ContentFeedData>;
