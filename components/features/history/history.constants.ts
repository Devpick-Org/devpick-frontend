import { type ElementType } from "react";
import {
  BookOpen,
  Sparkles,
  Bookmark,
  HelpCircle,
  Heart,
  MessageSquare,
  MessageCircle,
  LogIn,
  Award,
  BriefcaseBusiness,
  Mic,
} from "lucide-react";
import { QuizIconWrapper } from "./QuizIconWrapper";

import type {
  HistoryActionType,
  ActivityActionType,
  ActivityFilterValue,
  BadgeId,
} from "@/types/history";
import type { PeriodFilter } from "@/lib/history/groupByDate";

export interface ActionMeta {
  label: string;
  icon: ElementType;
  iconClass: string;
  iconBgClass: string;
  iconSizeClass?: string; // 기본값 "h-4 w-4", 특정 액션에서만 오버라이드
}


/** 액션 필터 chip 옵션 — 학습 탭 전용 */
export const ACTION_FILTER_OPTIONS: {
  value: HistoryActionType;
  label: string;
}[] = [
  { value: "content_opened", label: "원문 확인" },
  { value: "ai_summary_viewed", label: "AI 요약" },
  { value: "ai_quiz_completed", label: "AI 퀴즈" },
  { value: "question_created", label: "질문 작성" },
  { value: "scrapped", label: "글 스크랩" },
];

/** 액션 필터 chip 옵션 — 활동 탭 전용
 *  "answer"는 answer_written + answer_adopted를 묶는 가상 필터 값
 */
export const ACTIVITY_FILTER_OPTIONS: {
  value: ActivityFilterValue;
  label: string;
}[] = [
  { value: "daily_login", label: "출석" },
  { value: "content_liked", label: "좋아요" },
  { value: "answer", label: "답변" },
  { value: "comment_created", label: "댓글" },
  { value: "job_bookmarked", label: "채용 스크랩" },
  { value: "mock_interview_completed", label: "모의면접" },
];

/** 기간 필터 옵션 — 학습/활동 공용 */
export const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "7d", label: "최근 7일" },
  { value: "30d", label: "최근 30일" },
  { value: "all", label: "전체" },
];

/** 액션 메타 — 학습 탭 */
export const ACTION_META: Record<HistoryActionType, ActionMeta> = {
  content_opened: {
    label: "원문을 확인했어요",
    icon: BookOpen,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
  ai_summary_viewed: {
    label: "AI 요약을 확인했어요",
    icon: Sparkles,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
  scrapped: {
    label: "콘텐츠를 저장했어요",
    icon: Bookmark,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
  question_created: {
    label: "질문을 작성했어요",
    icon: HelpCircle,
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-50",
  },
  ai_quiz_completed: {
    label: "AI 퀴즈를 풀었어요",
    icon: QuizIconWrapper,
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-50",
  },
};

/** 액션 메타 — 활동 탭 */
export const ACTIVITY_ACTION_META: Record<ActivityActionType, ActionMeta> = {
  content_liked: {
    label: "좋아요를 눌렀어요",
    icon: Heart,
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-50",
  },
  answer_written: {
    label: "답변을 작성했어요",
    icon: MessageSquare,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
  answer_adopted: {
    label: "답변이 채택됐어요",
    icon: Award,
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-50",
    iconSizeClass: "h-5 w-5",
  },
  comment_created: {
    label: "댓글을 작성했어요",
    icon: MessageCircle,
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-50",
  },
  daily_login: {
    label: "출석했어요",
    icon: LogIn,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
  job_bookmarked: {
    label: "채용공고를 저장했어요",
    icon: BriefcaseBusiness,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
  mock_interview_completed: {
    label: "모의면접을 완료했어요",
    icon: Mic,
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
};

