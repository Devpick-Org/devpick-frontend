import type {
  HistoryParams,
  HistoryPageResponse,
  ActivityPageResponse,
  BadgesResponse,
  PointsSummaryResponse,
} from "@/types/history";
import {
  mockGetHistoryList,
  mockGetActivityList,
  mockGetBadges,
  mockGetPointsSummary,
} from "@/lib/mock/history";

// TODO: 실제 API 연동 시 아래 import를 활성화하고 각 함수 내부를 교체
// import { apiClient } from "../client";

// ── actionTypes 상수 ───────────────────────────────────────────────────────────
// 실제 API 연동 시 각 함수의 default actionTypes로 사용
const LEARNING_ACTION_TYPES = [
  "content_opened",
  "ai_summary_viewed",
  "scrapped",
  "question_created",
];
const ACTIVITY_ACTION_TYPES = [
  "content_liked",
  "answer_written",
  "answer_adopted",
  "comment_created",
  "daily_login",
];

// ── query key 상수 ─────────────────────────────────────────────────────────────
export const HISTORY_QUERY_KEYS = {
  list: (params: HistoryParams) => ["history", params] as const,
  activityList: (params: HistoryParams) =>
    ["history", "activity", params] as const,
  badges: ["history", "badges"] as const,
  points: ["history", "points"] as const,
};

export const historyEndpoints = {
  /**
   * 학습 히스토리 조회
   *
   * [현재] mock 반환 — params.actionTypes / startDate / endDate 무시
   * [연동] GET /history?actionTypes=content_opened,ai_summary_viewed,scrapped,question_created&page=0&size=20
   *
   * TODO: mock → real 전환 시 아래 주석 활성화
   * return apiClient
   *   .get<HistoryPageResponse>("/history", {
   *     params: {
   *       ...params,
   *       actionTypes: (params.actionTypes ?? LEARNING_ACTION_TYPES).join(","),
   *     },
   *   })
   *   .then((r) => r.data);
   */
  getHistoryList: (params: HistoryParams = {}): Promise<HistoryPageResponse> => {
    return mockGetHistoryList(params);
  },

  /**
   * 활동 내역 조회
   *
   * [현재] mock 반환 — params.actionTypes / startDate / endDate 무시
   * [연동] GET /history?actionTypes=content_liked,answer_written,comment_created&page=0&size=20
   *        주의: /history/activity 엔드포인트는 존재하지 않음
   *              /history 하나에 actionTypes 파라미터로 학습/활동 구분
   *
   * TODO: mock → real 전환 시 아래 주석 활성화
   * return apiClient
   *   .get<ActivityPageResponse>("/history", {
   *     params: {
   *       ...params,
   *       actionTypes: (params.actionTypes ?? ACTIVITY_ACTION_TYPES).join(","),
   *     },
   *   })
   *   .then((r) => r.data);
   */
  getActivityList: (
    params: HistoryParams = {},
  ): Promise<ActivityPageResponse> => {
    return mockGetActivityList(params);
  },

  /**
   * 배지 목록 조회
   *
   * [현재] mock 반환
   * [연동] GET /history/badges
   *
   * TODO: mock → real 전환 시 아래 주석 활성화
   * return apiClient.get<BadgesResponse>("/history/badges").then((r) => r.data);
   */
  getBadges: (): Promise<BadgesResponse> => {
    return mockGetBadges();
  },

  /**
   * 포인트 요약 조회
   *
   * [현재] mock 반환
   * [연동] GET /history/points
   *
   * TODO: mock → real 전환 시 아래 주석 활성화
   * return apiClient.get<PointsSummaryResponse>("/history/points").then((r) => r.data);
   */
  getPointsSummary: (): Promise<PointsSummaryResponse> => {
    return mockGetPointsSummary();
  },
};

// 상수 외부 노출 (연동 시 params 기본값으로 활용 가능)
export { LEARNING_ACTION_TYPES, ACTIVITY_ACTION_TYPES };
export type { BadgesResponse, PointsSummaryResponse };
