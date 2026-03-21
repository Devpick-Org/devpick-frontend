import type { ApiResponse } from "./api";

/** GET /history actionType — 학습 탭 전용 */
export type HistoryActionType =
  | "content_opened"
  | "ai_summary_viewed"
  | "scrapped"
  | "question_created";

/** GET /history/activity actionType — 활동 탭 전용 */
export type ActivityActionType =
  | "content_liked"
  | "answer_written"
  | "comment_created";

/** 히스토리 아이템이 참조하는 콘텐츠 요약 */
export interface HistoryContentRef {
  id: string;
  title: string;
  preview?: string;
}

/** 히스토리 아이템이 참조하는 게시글 요약 */
export interface HistoryPostRef {
  id: string;
  title: string;
}

/** GET /history 단일 행동 기록 */
export interface HistoryItem {
  id: string;
  actionType: HistoryActionType;
  content: HistoryContentRef | null;
  post: HistoryPostRef | null;
  createdAt: string;
}

/** GET /history/activity 단일 행동 기록 (content_liked 포함) */
export interface ActivityItem {
  id: string;
  actionType: ActivityActionType;
  content: HistoryContentRef | null;
  post: HistoryPostRef | null;
  createdAt: string;
}

/** GET /history 페이지 응답 data */
export interface HistoryPageData {
  items: HistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** GET /history/activity 페이지 응답 data */
export interface ActivityPageData {
  items: ActivityItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** getHistoryList / getActivityList 공통 query params */
export interface HistoryParams {
  page?: number;
  size?: number;
}

export type HistoryPageResponse = ApiResponse<HistoryPageData>;
export type ActivityPageResponse = ApiResponse<ActivityPageData>;
