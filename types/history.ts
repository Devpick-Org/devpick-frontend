import type { ApiResponse } from "./api";

/** GET /history actionType — 학습 탭 (actionTypes 파라미터로 필터) */
export type HistoryActionType =
  | "content_opened"
  | "ai_summary_viewed"
  | "scrapped"
  | "question_created";

/** GET /history actionType — 활동 탭 (actionTypes 파라미터로 필터) */
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

/** 히스토리 아이템이 참조하는 답변 (answer_written / comment_created 시 존재) */
export interface HistoryAnswerRef {
  id: string;
}

/**
 * GET /history 단일 행동 기록 — 학습 탭
 * createdAt: "YYYY-MM-DDTHH:mm:ss" — timezone 없는 서버 로컬 시간(KST)
 * 삭제된 참조 항목은 해당 필드가 null로 반환됨
 */
export interface HistoryItem {
  id: string;
  actionType: HistoryActionType;
  content: HistoryContentRef | null;
  post: HistoryPostRef | null;
  answer: HistoryAnswerRef | null;
  createdAt: string;
}

/**
 * GET /history 단일 행동 기록 — 활동 탭
 * createdAt: "YYYY-MM-DDTHH:mm:ss" — timezone 없는 서버 로컬 시간(KST)
 * 삭제된 참조 항목은 해당 필드가 null로 반환됨
 */
export interface ActivityItem {
  id: string;
  actionType: ActivityActionType;
  content: HistoryContentRef | null;
  post: HistoryPostRef | null;
  answer: HistoryAnswerRef | null;
  createdAt: string;
}

/** GET /history 페이지 응답 data — 학습 탭 */
export interface HistoryPageData {
  items: HistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** GET /history 페이지 응답 data — 활동 탭 */
export interface ActivityPageData {
  items: ActivityItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * GET /history 쿼리 파라미터
 *
 * 실제 API 연동 시:
 * - actionTypes: 콤마 구분 문자열로 join해서 전달 (생략 시 전체 반환)
 * - startDate / endDate: ISO 8601 Z 포함 ("2026-03-01T00:00:00Z")
 * - page: 0-based 정수, size: 기본 20, 최대 100
 *
 * mock 단계에서는 actionTypes / startDate / endDate 무시됨
 * (로컬 filterByPeriod / filterByActions 로 대체)
 */
export interface HistoryParams {
  actionTypes?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export type HistoryPageResponse = ApiResponse<HistoryPageData>;
export type ActivityPageResponse = ApiResponse<ActivityPageData>;
