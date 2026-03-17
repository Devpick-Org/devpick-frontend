import type { ApiResponse } from "./api";

export type PostLevel = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";

/** GET /posts 응답 아이템 (API spec 기준) */
export interface PostSummary {
  id: string;
  title: string;
  level: PostLevel;
  authorId: string;
  authorNickname: string;
  answerCount: number;
  createdAt: string;
  contentPreview: string;
  topAnswerPreview?: string | null;
}

export interface PostListData {
  posts: PostSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type PostListResponse = ApiResponse<PostListData>;
