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
  translatedTitle?: string | null;
  author: string | null;
  sourceName: string;
  preview: string;
  thumbnailUrl: string | null;
  thumbnailWidth?: number | null;
  thumbnailHeight?: number | null;
  canonicalUrl: string;
  tags: string[];
  publishedAt: string;
  isScrapped: boolean;
  isLiked: boolean;
}

export interface ContentDetail extends Content {
  originalContent?: string | null;
  isOriginalVisible: boolean;
  licenseType?: string | null;
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
