import type { ApiResponse } from "./api";

/** GET /history actionType — 학습 탭 (actionTypes 파라미터로 필터) */
export type HistoryActionType =
  | "content_opened"
  | "ai_summary_viewed"
  | "scrapped"
  | "question_created"
  | "ai_quiz_completed";

/** GET /history actionType — 활동 탭 (actionTypes 파라미터로 필터) */
export type ActivityActionType =
  | "content_liked"
  | "answer_written"
  | "answer_adopted"
  | "comment_created"
  | "daily_login"
  | "job_bookmarked"
  | "mock_interview_completed";

/**
 * 활동 탭 필터 칩 값 — "answer"는 answer_written + answer_adopted를 묶는 가상 값
 * HistoryFilterBar에 전달할 때 사용하며 실제 API 파라미터로는 변환 후 전달
 */
export type ActivityFilterValue = ActivityActionType | "answer";

/** 히스토리 아이템이 참조하는 콘텐츠 요약 */
export interface HistoryContentRef {
  id: string;
  title: string;
  translatedTitle: string | null;
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
  preview: string | null;
}

/** 히스토리 아이템이 참조하는 댓글 (comment_created 시 존재) */
export interface HistoryCommentRef {
  id: string;
  preview: string | null;
}

/** 히스토리 아이템이 참조하는 채용공고 (job_bookmarked / mock_interview_completed 시 존재) */
export interface HistoryJobPostingRef {
  id: string;
  title: string;
  companyName: string;
}

/**
 * GET /history 단일 행동 기록 — 학습 탭
 * createdAt: "YYYY-MM-DDTHH:mm:ssZ" — UTC ISO 8601 (KST = UTC+9)
 * 삭제된 참조 항목은 해당 필드가 null로 반환됨
 * points: 해당 행동으로 적립된 포인트 (ai_summary_viewed는 필드 없음)
 */
export interface HistoryItem {
  id: string;
  actionType: HistoryActionType;
  content: HistoryContentRef | null;
  post: HistoryPostRef | null;
  answer: HistoryAnswerRef | null;
  createdAt: string;
  points?: number | null;
}

/**
 * GET /history 단일 행동 기록 — 활동 탭
 * createdAt: "YYYY-MM-DDTHH:mm:ssZ" — UTC ISO 8601 (KST = UTC+9)
 * 삭제된 참조 항목은 해당 필드가 null로 반환됨
 * points: 해당 행동으로 적립된 포인트 (미지원 시 null)
 */
export interface ActivityItem {
  id: string;
  actionType: ActivityActionType;
  content: HistoryContentRef | null;
  post: HistoryPostRef | null;
  answer: HistoryAnswerRef | null;
  comment: HistoryCommentRef | null;
  jobPosting: HistoryJobPostingRef | null;
  createdAt: string;
  points?: number | null;
}

/** 배지 ID — 서버 정의 값 */
export type BadgeId =
  | "FIRST_SCRAP"
  | "FIRST_QUESTION"
  | "ANSWER_MASTER"
  | "POINT_100"
  | "POINT_500"
  | "POINT_1000"
  | "STREAK_7";

/** 단일 배지 */
export interface BadgeItem {
  badgeId: BadgeId;
  name: string;
  description: string;
  acquired: boolean;
  acquiredAt: string | null; // null → 미획득
}

/** 포인트 요약 */
export interface PointsSummary {
  totalPoints: number;
  weeklyPoints: number;
  streak: number; // 연속 로그인 일수
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
export type BadgesResponse = ApiResponse<BadgeItem[]>;
export type PointsSummaryResponse = ApiResponse<PointsSummary>;
