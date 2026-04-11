import { apiClient } from "../client";
import type {
  Content,
  ContentDetail,
  ContentDetailResponse,
  ContentFeedResponse,
  AiSummaryLevel,
  AiSummaryResponse,
} from "@/types/content";

export const contentsEndpoints = {
  /** GET /contents — 개인화 피드 목록 */
  getContents: (params: {
    page: number;
    size: number;
  }): Promise<ContentFeedResponse> => {
    return apiClient
      .get<ContentFeedResponse>("/contents", { params })
      .then((r) => r.data);
  },

  /** GET /contents/:contentId — 글 상세 */
  getContentById: (id: string): Promise<ContentDetailResponse> => {
    return apiClient
      .get<ContentDetailResponse>(`/contents/${id}`)
      .then((r) => r.data);
  },

  /** GET /contents/:contentId/recommendations — 추천 콘텐츠 */
  getContentRecommendations: (
    contentId: string,
    size = 5,
  ): Promise<ContentFeedResponse> => {
    return apiClient
      .get<ContentFeedResponse>(`/contents/${contentId}/recommendations`, {
        params: { size },
      })
      .then((r) => r.data);
  },

  /** GET /contents/search — 글 검색 */
  searchContents: (params: {
    query: string;
    tags?: string[];
    page: number;
    size: number;
  }): Promise<ContentFeedResponse> => {
    return apiClient
      .get<ContentFeedResponse>("/contents/search", { params })
      .then((r) => r.data);
  },

  /** GET /contents/:contentId/summary?level=... — AI 요약 조회 */
  getContentSummary: (
    contentId: string,
    level: AiSummaryLevel = "JUNIOR",
  ): Promise<AiSummaryResponse> => {
    return apiClient
      .get<AiSummaryResponse>(`/contents/${contentId}/summary`, {
        params: { level },
      })
      .then((r) => r.data);
  },

  /** POST /contents/:contentId/summary/retry?level=... — AI 요약 재시도 */
  retryContentSummary: (
    contentId: string,
    level: AiSummaryLevel = "JUNIOR",
  ): Promise<AiSummaryResponse> => {
    return apiClient
      .post<AiSummaryResponse>(
        `/contents/${contentId}/summary/retry`,
        null,
        { params: { level } },
      )
      .then((r) => r.data);
  },

  /** POST /contents/:contentId/scrap */
  scrapContent: (contentId: string): Promise<void> => {
    return apiClient
      .post(`/contents/${contentId}/scrap`)
      .then(() => undefined);
  },

  /** DELETE /contents/:contentId/scrap */
  unscrapContent: (contentId: string): Promise<void> => {
    return apiClient
      .delete(`/contents/${contentId}/scrap`)
      .then(() => undefined);
  },

  /** POST /contents/:contentId/like */
  likeContent: (contentId: string): Promise<void> => {
    return apiClient
      .post(`/contents/${contentId}/like`)
      .then(() => undefined);
  },

  /** DELETE /contents/:contentId/like */
  unlikeContent: (contentId: string): Promise<void> => {
    return apiClient
      .delete(`/contents/${contentId}/like`)
      .then(() => undefined);
  },
};

// re-export — 컴포넌트에서 타입 import 경로 유지
export type { Content, ContentDetail };
