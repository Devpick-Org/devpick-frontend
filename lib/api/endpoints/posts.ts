import { apiClient } from "../client";
import type { PostListResponse } from "@/types/post";
import type {
  PostDetailResponse,
  AnswerListResponse,
  CommunityAnswer,
  CommentDTO,
  AiAnswer,
  SimilarPost,
} from "@/types/community";
import type { ApiResponse } from "@/types/api";
import { MOCK_POSTS } from "@/lib/mock/posts";
import {
  MOCK_POST_STORE,
  MOCK_AI_ANSWER_STORE,
  MOCK_SIMILAR_POSTS_STORE,
  mockAnswerStore,
} from "@/lib/mock/community";
import { useAuthStore } from "@/store/auth.store";

// mockAnswerStore 기준으로 answerCount와 topAnswerPreview를 계산합니다.
// 채택된 답변이 있으면 그 답변, 없으면 첫 번째 답변의 내용을 preview로 사용합니다.
function enrichPost(post: (typeof MOCK_POSTS)[number]) {
  const answers = mockAnswerStore.getAll(post.id);
  const answerCount = answers.length;
  const topAnswer =
    answers.find((a) => a.isAdopted) ?? (answers.length > 0 ? answers[0] : null);
  const topAnswerPreview = topAnswer
    ? topAnswer.content.replace(/```[\s\S]*?```/g, "").replace(/[#*`_>]/g, "").trim().slice(0, 120)
    : null;
  return { ...post, answerCount, topAnswerPreview };
}

export const postsEndpoints = {
  // ─── 게시글 목록 ────────────────────────────────────────────────────────────

  /** GET /posts — 게시글 목록 (page: 0-based) */
  getPosts: (
    params: { page?: number; size?: number } = {},
  ): Promise<PostListResponse> => {
    const page = params.page ?? 0;
    const size = params.size ?? 20;

    return new Promise((resolve) => {
      setTimeout(() => {
        const start = page * size;
        const pagedPosts = MOCK_POSTS.slice(start, start + size).map(enrichPost);
        resolve({
          success: true,
          data: {
            posts: pagedPosts,
            page,
            size,
            totalElements: MOCK_POSTS.length,
            totalPages: Math.ceil(MOCK_POSTS.length / size),
          },
          message: "게시글 목록을 불러왔습니다",
        });
      }, 800);
    });
  },

  /** GET /posts (query 필터) — mock 전용, 추후 별도 검색 API로 교체 예정 */
  searchPosts: (params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<PostListResponse> => {
    const page = params.page ?? 0;
    const size = params.size ?? 20;
    const q = params.query.trim().toLowerCase();

    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_POSTS.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.authorNickname.toLowerCase().includes(q),
        );
        const start = page * size;
        const pagedPosts = filtered.slice(start, start + size).map(enrichPost);
        resolve({
          success: true,
          data: {
            posts: pagedPosts,
            page,
            size,
            totalElements: filtered.length,
            totalPages: Math.ceil(filtered.length / size),
          },
          message: "검색 결과를 불러왔습니다",
        });
      }, 600);
    });
  },

  // ─── 게시글 상세 조회 ────────────────────────────────────────────────────────

  /** GET /posts/{postId} */
  getPostDetail: (postId: string): Promise<PostDetailResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = MOCK_POST_STORE[postId];

        if (post) {
          const answerCount = mockAnswerStore.getAll(postId).length;
          resolve({
            success: true,
            data: { ...post, answerCount },
            message: "게시글을 불러왔습니다",
          });
          return;
        }

        // MOCK_POST_STORE에 없으면 MOCK_POSTS 목록 데이터로 fallback
        const summary = MOCK_POSTS.find((p) => p.id === postId);
        if (!summary) {
          reject(new Error("게시글을 찾을 수 없습니다"));
          return;
        }
        resolve({
          success: true,
          data: {
            id: summary.id,
            title: summary.title,
            content: summary.contentPreview,
            level: summary.level,
            authorId: summary.authorId,
            authorNickname: summary.authorNickname,
            answerCount: summary.answerCount,
            createdAt: summary.createdAt,
            updatedAt: summary.createdAt,
            attachments: [],
          },
          message: "게시글을 불러왔습니다",
        });
      }, 400);
    });
  },

  /** GET /posts/{postId}/answers — 답변 목록 (댓글 포함) */
  getPostAnswers: (postId: string): Promise<AnswerListResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postExists =
          !!MOCK_POST_STORE[postId] ||
          MOCK_POSTS.some((p) => p.id === postId);
        if (!postExists) {
          reject(new Error("게시글을 찾을 수 없습니다"));
          return;
        }
        resolve({
          success: true,
          data: { answers: mockAnswerStore.getAll(postId) },
          message: "답변 목록을 불러왔습니다",
        });
      }, 500);
    });
  },

  /** GET /posts/{postId}/ai-answer — AI 1차 답변 (미구현, mock) */
  getAiAnswer: (postId: string): Promise<ApiResponse<AiAnswer | null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: MOCK_AI_ANSWER_STORE[postId] ?? null,
          message: "AI 답변을 불러왔습니다",
        });
      }, 700);
    });
  },

  /** GET /posts/{postId}/similar — 유사 질문 (미구현, mock) */
  getSimilarPosts: (postId: string): Promise<ApiResponse<SimilarPost[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: MOCK_SIMILAR_POSTS_STORE[postId] ?? [],
          message: "유사 질문을 불러왔습니다",
        });
      }, 600);
    });
  },

  // ─── 답변 CRUD ──────────────────────────────────────────────────────────────

  /** POST /posts/{postId}/answers */
  createAnswer: (
    postId: string,
    content: string,
  ): Promise<ApiResponse<CommunityAnswer>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!MOCK_POST_STORE[postId]) {
          reject(new Error("게시글을 찾을 수 없습니다"));
          return;
        }
        const { user } = useAuthStore.getState();
        if (!user) {
          reject(new Error("로그인이 필요합니다"));
          return;
        }
        const newAnswer = mockAnswerStore.create(postId, {
          id: `answer-${Date.now()}`,
          postId,
          content,
          authorId: user.userId,
          authorNickname: user.nickname,
          isAdopted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
        });
        resolve({
          success: true,
          data: newAnswer,
          message: "답변이 등록되었습니다",
        });
      }, 400);
    });
  },

  /** PUT /posts/{postId}/answers/{answerId} */
  updateAnswer: (
    postId: string,
    answerId: string,
    content: string,
  ): Promise<ApiResponse<CommunityAnswer>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updated = mockAnswerStore.update(postId, answerId, content);
          resolve({
            success: true,
            data: updated,
            message: "답변이 수정되었습니다",
          });
        } catch {
          reject(new Error("답변을 찾을 수 없습니다"));
        }
      }, 400);
    });
  },

  /** DELETE /posts/{postId}/answers/{answerId} — 204 No Content */
  deleteAnswer: (postId: string, answerId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAnswerStore.delete(postId, answerId);
        resolve();
      }, 300);
    });
  },

  /** POST /posts/{postId}/answers/{answerId}/adopt */
  adoptAnswer: (
    postId: string,
    answerId: string,
  ): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAnswerStore.adopt(postId, answerId);
        resolve({
          success: true,
          data: null,
          message: "답변이 채택되었습니다",
        });
      }, 300);
    });
  },

  // ─── 댓글 ──────────────────────────────────────────────────────────────────

  /** POST /posts/{postId}/answers/{answerId}/comments */
  createComment: (
    postId: string,
    answerId: string,
    content: string,
  ): Promise<ApiResponse<CommentDTO>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!MOCK_POST_STORE[postId]) {
          reject(new Error("게시글을 찾을 수 없습니다"));
          return;
        }
        const { user } = useAuthStore.getState();
        if (!user) {
          reject(new Error("로그인이 필요합니다"));
          return;
        }
        const now = new Date().toISOString();
        const newComment = mockAnswerStore.addComment(postId, answerId, {
          id: `comment-${Date.now()}`,
          answerId,
          userId: user.userId,
          nickname: user.nickname,
          content,
          createdAt: now,
          updatedAt: now,
        });
        resolve({
          success: true,
          data: newComment,
          message: "댓글이 등록되었습니다",
        });
      }, 300);
    });
  },

  /** DELETE /posts/{postId}/answers/{answerId}/comments/{commentId} — 204 No Content */
  deleteComment: (
    postId: string,
    answerId: string,
    commentId: string,
  ): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAnswerStore.deleteComment(postId, answerId, commentId);
        resolve();
      }, 300);
    });
  },

  // ─── 게시글 작성/개선 (미구현) ───────────────────────────────────────────────

  /** POST /posts */
  createPost: () => {
    throw new Error("Not implemented");
    return apiClient.post("/posts");
  },

  /** DELETE /posts/{postId} — 204 No Content */
  deletePost: (_postId: string): Promise<void> => {
    throw new Error("Not implemented");
  },

  /** POST /posts/refine */
  refinePost: () => {
    throw new Error("Not implemented");
    return apiClient.post("/posts/refine");
  },
};
