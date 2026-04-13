import { apiClient } from "../client";
import type { PostListResponse } from "@/types/post";
import type {
  PostDetailResponse,
  PostAttachmentDTO,
  AnswerListResponse,
  CommunityAnswer,
  CommentDTO,
  AiAnswerResponse,
  SimilarPostListResponse,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  RefinePostRequest,
  RefinePostResponse,
} from "@/types/community";
import type { ApiResponse } from "@/types/api";

export const postsEndpoints = {
  // ─── 첨부파일 업로드 ────────────────────────────────────────────────────────

  /** POST /attachments — 파일을 S3에 업로드하고 URL 반환 */
  uploadAttachment: (file: File): Promise<PostAttachmentDTO> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<ApiResponse<PostAttachmentDTO>>("/attachments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },
  // ─── 게시글 목록 ────────────────────────────────────────────────────────────

  /** GET /posts — 게시글 목록 */
  getPosts: (
    params: { page?: number; size?: number } = {},
  ): Promise<PostListResponse> => {
    return apiClient
      .get<PostListResponse>("/posts", { params })
      .then((r) => r.data);
  },

  /** GET /posts?query=... — 게시글 검색 */
  searchPosts: (params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<PostListResponse> => {
    return apiClient
      .get<PostListResponse>("/posts", { params })
      .then((r) => r.data);
  },

  // ─── 게시글 상세 ────────────────────────────────────────────────────────────

  /** GET /posts/{postId} */
  getPostDetail: (postId: string): Promise<PostDetailResponse> => {
    return apiClient
      .get<PostDetailResponse>(`/posts/${postId}`)
      .then((r) => r.data);
  },

  /** GET /posts/{postId}/answers — 답변 및 댓글 통합 조회 */
  getPostAnswers: (postId: string): Promise<AnswerListResponse> => {
    return apiClient
      .get<AnswerListResponse>(`/posts/${postId}/answers`)
      .then((r) => r.data);
  },

  /** POST /posts/{postId}/ai-answer — AI 답변 생성 */
  getAiAnswer: (postId: string): Promise<AiAnswerResponse> => {
    return apiClient
      .post<AiAnswerResponse>(`/posts/${postId}/ai-answer`)
      .then((r) => r.data);
  },

  /** GET /posts/{postId}/similar — 유사 질문 조회 */
  getSimilarPosts: (postId: string): Promise<SimilarPostListResponse> => {
    return apiClient
      .get<SimilarPostListResponse>(`/posts/${postId}/similar`)
      .then((r) => r.data);
  },

  // ─── 답변 CRUD ──────────────────────────────────────────────────────────────

  /** POST /posts/{postId}/answers */
  createAnswer: (
    postId: string,
    content: string,
  ): Promise<ApiResponse<CommunityAnswer>> => {
    return apiClient
      .post<ApiResponse<CommunityAnswer>>(`/posts/${postId}/answers`, {
        content,
      })
      .then((r) => r.data);
  },

  /** PUT /posts/{postId}/answers/{answerId} */
  updateAnswer: (
    postId: string,
    answerId: string,
    content: string,
  ): Promise<ApiResponse<CommunityAnswer>> => {
    return apiClient
      .put<ApiResponse<CommunityAnswer>>(
        `/posts/${postId}/answers/${answerId}`,
        { content },
      )
      .then((r) => r.data);
  },

  /** DELETE /posts/{postId}/answers/{answerId} — 204 No Content */
  deleteAnswer: (postId: string, answerId: string): Promise<void> => {
    return apiClient
      .delete(`/posts/${postId}/answers/${answerId}`)
      .then(() => undefined);
  },

  /** POST /posts/{postId}/answers/{answerId}/adopt */
  adoptAnswer: (
    postId: string,
    answerId: string,
  ): Promise<ApiResponse<null>> => {
    return apiClient
      .post<ApiResponse<null>>(`/posts/${postId}/answers/${answerId}/adopt`)
      .then((r) => r.data);
  },

  // ─── 댓글 ──────────────────────────────────────────────────────────────────

  /** POST /posts/{postId}/answers/{answerId}/comments */
  createComment: (
    postId: string,
    answerId: string,
    content: string,
  ): Promise<ApiResponse<CommentDTO>> => {
    return apiClient
      .post<ApiResponse<CommentDTO>>(
        `/posts/${postId}/answers/${answerId}/comments`,
        { content },
      )
      .then((r) => r.data);
  },

  /** DELETE /posts/{postId}/answers/{answerId}/comments/{commentId} — 204 No Content */
  deleteComment: (
    postId: string,
    answerId: string,
    commentId: string,
  ): Promise<void> => {
    return apiClient
      .delete(`/posts/${postId}/answers/${answerId}/comments/${commentId}`)
      .then(() => undefined);
  },

  // ─── 게시글 작성/수정/삭제 ──────────────────────────────────────────────────

  /** POST /posts — 질문 작성 */
  createPost: (req: CreatePostRequest): Promise<CreatePostResponse> => {
    return apiClient
      .post<CreatePostResponse>("/posts", req)
      .then((r) => r.data);
  },

  /** PUT /posts/{postId} — 게시글 수정 */
  updatePost: (
    postId: string,
    req: UpdatePostRequest,
  ): Promise<UpdatePostResponse> => {
    return apiClient
      .put<UpdatePostResponse>(`/posts/${postId}`, req)
      .then((r) => r.data);
  },

  /** DELETE /posts/{postId} — 204 No Content */
  deletePost: (postId: string): Promise<void> => {
    return apiClient
      .delete(`/posts/${postId}`)
      .then(() => undefined);
  },

  // ─── AI 질문 개선 ────────────────────────────────────────────────────────────

  /** POST /posts/refine — AI 질문 개선 */
  refinePost: (req: RefinePostRequest): Promise<RefinePostResponse> => {
    return apiClient
      .post<RefinePostResponse>("/posts/refine", req)
      .then((r) => r.data);
  },
};
