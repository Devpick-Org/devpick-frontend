import { apiClient } from "../client";
import type {
  Content,
  ContentDetail,
  ContentDetailResponse,
  ContentFeedResponse,
  AiSummary,
  AiSummaryLevel,
  AiSummaryResponse,
} from "@/types/content";

/** GET /summary 응답 discriminated union */
type SummaryResult =
  | { ready: true; summary: AiSummary }
  | { ready: false };

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

  /**
   * GET /contents/search — 글 검색 (DP-315)
   * - 비로그인 호출 가능 (Authorization 없이 요청 가능).
   * - accessToken이 있으면 인터셉터가 Bearer를 붙이고, 응답의 스크랩·좋아요 여부가 사용자 기준으로 반영됨.
   */
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

  /** GET /contents/:contentId/summary?level=... — AI 요약 조회
   * 202 (success: false) → { ready: false } — 폴링 대상
   * 200 (success: true)  → { ready: true, summary }
   */
  getContentSummary: (
    contentId: string,
    level: AiSummaryLevel = "JUNIOR",
  ): Promise<SummaryResult> => {
    return apiClient
      .get(`/contents/${contentId}/summary`, { params: { level } })
      .then((r) => {
        const body = r.data as AiSummaryResponse;
        if (!body.success) return { ready: false } as const;
        return { ready: true, summary: body.data } as const;
      });
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

  /** POST /contents/:contentId/read-original — 원문 확인 기록 */
  readOriginal: (contentId: string): Promise<void> => {
    return apiClient
      .post(`/contents/${contentId}/read-original`)
      .then(() => undefined);
  },
};

// re-export — 컴포넌트에서 타입 import 경로 유지
export type { Content, ContentDetail };
