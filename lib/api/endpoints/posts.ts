import { apiClient } from "../client";

// TODO: DP-211 (커뮤니티 화면 개발) 시 구현
export const postsEndpoints = {
  /** POST /posts — 질문 작성 */
  createPost: () => {
    throw new Error("Not implemented");
    return apiClient.post("/posts");
  },

  /** GET /posts — 게시글 목록 */
  getPosts: () => {
    throw new Error("Not implemented");
    return apiClient.get("/posts");
  },

  /** GET /posts/:postId — 게시글 상세 (postId: number) */
  getPostById: () => {
    throw new Error("Not implemented");
    return apiClient.get("/posts/0");
  },

  /** POST /posts/refine — AI 질문 개선 */
  refinePost: () => {
    throw new Error("Not implemented");
    return apiClient.post("/posts/refine");
  },
};
