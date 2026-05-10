import { apiClient } from "../client";
import type {
  HistoryParams,
  HistoryPageResponse,
  ActivityPageResponse,
  BadgesResponse,
  PointsSummaryResponse,
} from "@/types/history";

// ── actionTypes 상수 ───────────────────────────────────────────────────────────
const LEARNING_ACTION_TYPES = [
  "content_opened",
  "ai_summary_viewed",
  "scrapped",
  "question_created",
  "ai_quiz_completed",
];

const ACTIVITY_ACTION_TYPES = [
  "content_liked",
  "answer_written",
  "answer_adopted",
  "comment_created",
  "daily_login",
  "job_bookmarked",
  "mock_interview_completed",
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
   * GET /history?actionTypes=content_opened,ai_summary_viewed,scrapped,question_created,ai_quiz_completed
   */
  getHistoryList: (params: HistoryParams = {}): Promise<HistoryPageResponse> => {
    return apiClient
      .get<HistoryPageResponse>("/history", {
        params: {
          ...params,
          actionTypes: (params.actionTypes ?? LEARNING_ACTION_TYPES).join(","),
        },
      })
      .then((r) => r.data);
  },

  /**
   * 활동 내역 조회
   * GET /history?actionTypes=content_liked,answer_written,answer_adopted,comment_created,daily_login
   * 답변 필터: params.actionTypes = ["answer_written", "answer_adopted"] 로 전달
   */
  getActivityList: (
    params: HistoryParams = {},
  ): Promise<ActivityPageResponse> => {
    return apiClient
      .get<ActivityPageResponse>("/history", {
        params: {
          ...params,
          actionTypes: (params.actionTypes ?? ACTIVITY_ACTION_TYPES).join(","),
        },
      })
      .then((r) => r.data);
  },

  /**
   * 배지 목록 조회
   * GET /history/badges
   */
  getBadges: (): Promise<BadgesResponse> => {
    return apiClient
      .get<BadgesResponse>("/history/badges")
      .then((r) => r.data);
  },

  /**
   * 포인트 요약 조회
   * GET /history/points
   */
  getPointsSummary: (): Promise<PointsSummaryResponse> => {
    return apiClient
      .get<PointsSummaryResponse>("/history/points")
      .then((r) => r.data);
  },
};

// 상수 외부 노출 (컴포넌트에서 params 기본값으로 활용 가능)
export { LEARNING_ACTION_TYPES, ACTIVITY_ACTION_TYPES };
export type { BadgesResponse, PointsSummaryResponse };
