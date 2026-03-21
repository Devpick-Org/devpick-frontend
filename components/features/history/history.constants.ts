import { type ElementType } from "react";
import { BookOpen, Sparkles, Bookmark, HelpCircle } from "lucide-react";

import type { HistoryActionType } from "@/types/history";
import type { PeriodFilter } from "@/lib/history/groupByDate";

export interface ActionMeta {
  label: string;
  icon: ElementType;
  iconClass: string;
  iconBgClass: string;
}

/** 액션 필터 chip 옵션 — 학습 탭 전용 (content_liked 제외) */
export const ACTION_FILTER_OPTIONS: { value: HistoryActionType; label: string }[] = [
  { value: "content_opened", label: "글 읽기" },
  { value: "ai_summary_viewed", label: "AI 요약" },
  { value: "question_created", label: "질문 작성" },
  { value: "scrapped", label: "스크랩" },
];

/** 기간 필터 segmented control 옵션 */
export const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "7d", label: "최근 7일" },
  { value: "30d", label: "최근 30일" },
  { value: "all", label: "전체" },
];

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
    iconClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
  },
};
