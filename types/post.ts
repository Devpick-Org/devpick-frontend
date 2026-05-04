import type { ApiResponse } from "./api";
import type { UserJob } from "./userProfile";

export type PostLevel = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";
export type PostType = "TECH" | "CAREER";

/** GET /posts 응답 아이템 (API spec 기준) */
export interface PostSummary {
  id: string;
  postType: PostType;
  title: string;
  level: PostLevel;
  authorId: string;
  authorNickname: string;
  authorProfileImage?: string | null;
  authorJob?: UserJob | null;
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
