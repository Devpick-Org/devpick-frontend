import { apiClient } from "../client";

// TODO: DP-211 (피드 화면 개발) 시 구현
export const contentsEndpoints = {
  /** GET /contents — 개인화 피드 목록 (params: { page: number; size: number }) */
  getContents: () => {
    throw new Error("Not implemented");
    return apiClient.get("/contents");
  },

  /** GET /contents/:contentId — 글 상세 (contentId: number) */
  getContentById: () => {
    throw new Error("Not implemented");
    return apiClient.get("/contents/0");
  },

  /** GET /contents/search — 글 검색 (query: string) */
  searchContents: () => {
    throw new Error("Not implemented");
    return apiClient.get("/contents/search");
  },

  /** POST /contents/:contentId/scrap — 스크랩 (contentId: number) */
  scrapContent: () => {
    throw new Error("Not implemented");
    return apiClient.post("/contents/0/scrap");
  },

  /** DELETE /contents/:contentId/scrap — 스크랩 취소 (contentId: number) */
  unscrapContent: () => {
    throw new Error("Not implemented");
    return apiClient.delete("/contents/0/scrap");
  },

  /** POST /contents/:contentId/like — 좋아요 (contentId: number) */
  likeContent: () => {
    throw new Error("Not implemented");
    return apiClient.post("/contents/0/like");
  },

  /** DELETE /contents/:contentId/like — 좋아요 취소 (contentId: number) */
  unlikeContent: () => {
    throw new Error("Not implemented");
    return apiClient.delete("/contents/0/like");
  },
};
