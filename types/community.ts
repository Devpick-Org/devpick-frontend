import type { PostLevel } from "./post";
import type { ApiResponse } from "./api";

// ─── 백엔드 확정 DTO ──────────────────────────────────────────────────────────

/** 첨부 파일 DTO */
export interface PostAttachmentDTO {
  type: "IMAGE" | "FILE";
  url: string;
  fileName: string;
}

/** GET /posts/{postId} 응답 DTO */
export interface PostDetailDTO {
  id: string;
  title: string;
  content: string;
  level: PostLevel;
  authorId: string;
  authorNickname: string;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
  attachments: PostAttachmentDTO[];
}

export type PostDetailResponse = ApiResponse<PostDetailDTO>;

/** 댓글 DTO */
export interface CommentDTO {
  id: string;
  content: string;
  userId: string;
  nickname: string;
  createdAt: string;
}

/** 답변 DTO (GET /posts/{postId}/answers 아이템 기준, comments 포함) */
export interface AnswerDTO {
  id: string;
  content: string;
  authorId: string;
  authorNickname: string;
  isAdopted: boolean;
  createdAt: string;
  updatedAt: string;
  comments: CommentDTO[];
}

// ─── 요청 타입 ────────────────────────────────────────────────────────────────

/** 질문 작성 폼의 임시 상태 (UI 전용) */
export interface PostDraft {
  title: string;
  content: string;
  level: PostLevel;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  level: PostLevel;
  attachments?: PostAttachmentDTO[];
}

export interface RefinePostRequest {
  title: string;
  content: string;
  level: PostLevel;
}

export interface RefinePostData {
  refinedTitle: string;
  refinedContent: string;
  /** 질문 품질 향상을 위한 보완 제안 목록 */
  suggestions: string[];
}

export type CreatePostResponse = ApiResponse<PostDetailDTO>;
export type RefinePostResponse = ApiResponse<RefinePostData>;

export interface UpdatePostRequest {
  title: string;
  content: string;
  level: PostLevel;
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
// 미확정 API(answers, ai-answer, similar)의 raw DTO는 확정하지 않고,
// 프론트에서 필요한 최소 타입만 유지합니다.

/** 화면용 타입 — AnswerDTO와 동일 (comments가 DTO에 포함됨) */
export type CommunityAnswer = AnswerDTO;

export type AnswerListResponse = ApiResponse<{ answers: AnswerDTO[] }>;

/** AI 1차 답변 (미확정 API) */
export interface AiAnswer {
  content: string;
  generatedAt: string;
}

/** 유사 질문 (미확정 API) */
export interface SimilarPost {
  id: string;
  title: string;
  answerCount: number;
  level: PostLevel;
}
