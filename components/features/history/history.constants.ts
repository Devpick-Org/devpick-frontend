import { type ElementType } from "react";
import {
  BookOpen,
  Sparkles,
  Bookmark,
  HelpCircle,
  Heart,
  MessageSquare,
  MessageCircle,
} from "lucide-react";

import type { HistoryActionType, ActivityActionType } from "@/types/history";
import type { PeriodFilter } from "@/lib/history/groupByDate";

export interface ActionMeta {
  label: string;
  icon: ElementType;
  iconClass: string;
  iconBgClass: string;
}

/** 액션 필터 chip 옵션 — 학습 탭 전용 */
export const ACTION_FILTER_OPTIONS: { value: HistoryActionType; label: string }[] = [
  { value: "content_opened", label: "글 읽기" },
  { value: "ai_summary_viewed", label: "AI 요약" },
  { value: "question_created", label: "질문 작성" },
  { value: "scrapped", label: "스크랩" },
];

/** 액션 필터 chip 옵션 — 활동 탭 전용 (좋아요 → 답변 → 댓글) */
export const ACTIVITY_FILTER_OPTIONS: { value: ActivityActionType; label: string }[] = [
  { value: "content_liked", label: "좋아요" },
  { value: "answer_written", label: "답변" },
  { value: "comment_created", label: "댓글" },
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
    label: "콘텐츠를 읽었어요",
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
};

/** 액션 메타 — 활동 탭 (좋아요 → 답변 → 댓글) */
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
  comment_created: {
    label: "댓글을 작성했어요",
    icon: MessageCircle,
    iconClass: "text-blue-500",
    iconBgClass: "bg-blue-50",
  },
};
