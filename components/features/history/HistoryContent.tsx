"use client";

import { AlertCircle, BookOpen } from "lucide-react";

import type { HistoryActionType } from "@/types/history";
import type { DateGroup, PeriodFilter } from "@/lib/history/groupByDate";
import { ACTION_FILTER_OPTIONS } from "./history.constants";
import HistoryFilterBar from "./HistoryFilterBar";
import HistoryTimeline from "./HistoryTimeline";

interface Props {
  groups?: DateGroup[];
  isLoading?: boolean;
  isError?: boolean;
  selectedActions: HistoryActionType[];
  onActionsChange: (actions: HistoryActionType[]) => void;
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

export default function HistoryContent({
  groups,
  isLoading,
  isError,
  selectedActions,
  onActionsChange,
  period,
  onPeriodChange,
}: Props) {
  return (
    <section className="space-y-4">
      <HistoryFilterBar
        actionOptions={ACTION_FILTER_OPTIONS}
        selectedActions={selectedActions}
        onActionsChange={onActionsChange}
        period={period}
        onPeriodChange={onPeriodChange}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : !groups || groups.length === 0 ? (
        <EmptyState />
      ) : (
        <HistoryTimeline groups={groups} />
      )}
    </section>
  );
}

// ── 내부 상태 컴포넌트 ────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, gi) => (
        <div key={gi}>
          {/* 날짜 헤더 스켈레톤 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-5 w-6 bg-muted rounded-full animate-pulse" />
          </div>
          {/* 타임라인 아이템 스켈레톤 */}
          <div>
            {Array.from({ length: 3 }).map((_, i) => {
              const isLast = i === 2;
              return (
                <div key={i} className="flex gap-3 items-center">
                  {/* 왼쪽: 아이콘 노드 + 세로 라인 */}
                  <div className="flex flex-col items-center shrink-0 w-8">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    {!isLast && (
                      <div className="w-px flex-1 min-h-3 bg-border mt-1" />
                    )}
                  </div>
                  {/* 오른쪽: 카드 스켈레톤 */}
                  <div className={isLast ? "flex-1" : "flex-1 pb-4"}>
                    <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-12 shrink-0 bg-muted rounded animate-pulse mt-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-md font-medium">학습 기록을 불러오지 못했습니다.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <BookOpen className="w-8 h-8" />
      <p className="text-md font-medium">아직 학습 기록이 없어요</p>
      <p className="text-sm font-medium text-muted-foreground">
        콘텐츠를 읽거나 AI 요약을 확인하면 여기에 기록됩니다.
      </p>
    </div>
  );
}
