import { ApiResponse } from "./api";

export interface Content {
  id: string;
  title: string;
  author: string;
  preview: string;
  canonicalUrl: string;
  tags: string[];
  publishedAt: string;
  isScrapped: boolean;
  isLiked: boolean;
  /** @mock API 확정 전 임시 필드 — 실제 응답 스키마와 다를 수 있음 */
  thumbnailUrl?: string;
}

export interface ContentDetail extends Content {
  originalContent?: string;
  isOriginalVisible: boolean;
  licenseType?: string;
  sourceName: string;
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
