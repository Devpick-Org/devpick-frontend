import { apiClient } from "../client";
import type { PostListResponse } from "@/types/post";
import { MOCK_POSTS } from "@/lib/mock/posts";

export const postsEndpoints = {
  /** GET /posts — 게시글 목록 (page: 0-based, size: default 20) */
  getPosts: (params: {
    page?: number;
    size?: number;
  } = {}): Promise<PostListResponse> => {
    const page = params.page ?? 0;
    const size = params.size ?? 20;

    return new Promise((resolve) => {
      setTimeout(() => {
        const start = page * size;
        const end = start + size;
        const pagedPosts = MOCK_POSTS.slice(start, end);

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
        const end = start + size;
        const pagedPosts = filtered.slice(start, end);

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

  /** POST /posts — 질문 작성 */
  createPost: () => {
    throw new Error("Not implemented");
    return apiClient.post("/posts");
  },

  /** GET /posts/:postId — 게시글 상세 */
  getPostById: (postId: string) => {
    throw new Error("Not implemented");
    return apiClient.get(`/posts/${postId}`);
  },

  /** POST /posts/refine — AI 질문 개선 */
  refinePost: () => {
    throw new Error("Not implemented");
    return apiClient.post("/posts/refine");
  },
};
