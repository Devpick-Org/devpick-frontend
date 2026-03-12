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
