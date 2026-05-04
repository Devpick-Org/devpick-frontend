import type { PostLevel, PostType } from "./post";
import type { ApiResponse } from "./api";
import type { UserJob } from "./userProfile";

// ─── 프론트 전용 로컬 타입 ────────────────────────────────────────────────────

/** 첨부 파일 로컬 관리용 — name 대신 id로 식별해 동명 파일 충돌 방지 */
export type LocalFileItem = {
  id: string;
  file: File;
};

// ─── 백엔드 확정 DTO ──────────────────────────────────────────────────────────

/** 첨부 파일 DTO */
export interface PostAttachmentDTO {
  type: "image" | "file";
  url: string;
  fileName: string;
}

/** GET /posts/{postId} 응답 DTO */
export interface PostDetailDTO {
  id: string;
  postType: PostType;
  title: string;
  content: string;
  level: PostLevel;
  authorId: string;
  authorNickname: string;
  authorProfileImage?: string | null;
  authorJob?: UserJob | null;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
  attachments?: PostAttachmentDTO[];
}

export type PostDetailResponse = ApiResponse<PostDetailDTO>;

/** 댓글 DTO */
export interface CommentDTO {
  id: string;
  content: string;
  userId: string;
  nickname: string;
  profileImage?: string | null;
  createdAt: string;
}

/** 답변 DTO (GET /posts/{postId}/answers 아이템 기준, comments 포함) */
export interface AnswerDTO {
  id: string;
  content: string;
  authorId: string;
  authorNickname: string;
  authorProfileImage?: string | null;
  authorJob?: string | null;
  authorLevel?: string | null;
  isAdopted: boolean;
  createdAt: string;
  updatedAt: string;
  comments: CommentDTO[];
}

// ─── 요청 타입 ────────────────────────────────────────────────────────────────

/** 질문 작성 폼의 임시 상태 (UI 전용) */
export interface PostDraft {
  postType: PostType;
  title: string;
  content: string;
  level: PostLevel;
}

export interface CreatePostRequest {
  postType: PostType;
  title: string;
  content: string;
  level: PostLevel;
  attachmentUrls?: string[];
}

export interface RefinePostRequest {
  title: string;
  content: string;
  level: PostLevel;
}

/** 백엔드 API 응답 원형 (snake_case) — API boundary 전용 */
export interface RefinePostRawData {
  refined_title: string;
  refined_content: string;
  suggestions: string[];
}

/** 프론트 내부 사용 타입 (camelCase) */
export interface RefinePostData {
  refinedTitle: string;
  refinedContent: string;
  suggestions: string[];
}

export type CreatePostResponse = ApiResponse<PostDetailDTO>;
export type UpdatePostResponse = ApiResponse<PostDetailDTO>;
export type RefinePostRawResponse = ApiResponse<RefinePostRawData>;

export interface UpdatePostRequest {
  title: string;
  content: string;
  level: PostLevel;
  attachmentUrls?: string[];
}

export interface CreateAnswerRequest {
  content: string;
}

export interface UpdateAnswerRequest {
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}

// ─── 화면용 타입 ──────────────────────────────────────────────────────────────

/** 화면용 타입 — AnswerDTO와 동일 (comments가 DTO에 포함됨) */
export type CommunityAnswer = AnswerDTO;

export type AnswerListResponse = ApiResponse<{ answers: AnswerDTO[] }>;

/** AI 1차 답변 (POST /posts/{postId}/ai-answer) */
export interface AiAnswer {
  id: string;
  postId: string;
  content: string;
  keyPoints: string[] | null;
  suggestedTags: string[] | null;
  confidence: number | null; // 0.0 ~ 1.0
  isAdopted: boolean;
  createdAt: string;
}

export type AiAnswerResponse = ApiResponse<AiAnswer | null>;

/** 유사 질문 (GET /posts/{postId}/similar) */
export interface SimilarPost {
  id: string;
  title: string;
  level: PostLevel;
  answerCount: number;
  createdAt: string;
}

export type SimilarPostListResponse = ApiResponse<{ posts: SimilarPost[] }>;
