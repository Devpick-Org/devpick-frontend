"use client";

import { AlertCircle, Activity } from "lucide-react";

import type { ActivityFilterValue, ActivityItem } from "@/types/history";
import type { DateGroup, PeriodFilter } from "@/lib/history/groupByDate";
import { ACTIVITY_FILTER_OPTIONS } from "./history.constants";
import HistoryFilterBar from "./HistoryFilterBar";
import ActivityTimeline from "./ActivityTimeline";

interface Props {
  groups?: DateGroup<ActivityItem>[];
  isLoading?: boolean;
  isError?: boolean;
  selectedActions: ActivityFilterValue[];
  onActionsChange: (actions: ActivityFilterValue[]) => void;
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

export default function ActivityContent({
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
        actionOptions={ACTIVITY_FILTER_OPTIONS}
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
        <ActivityTimeline groups={groups} />
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
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-5 w-6 bg-muted rounded-full animate-pulse" />
          </div>
          <div>
            {Array.from({ length: 3 }).map((_, i) => {
              const isLast = i === 2;
              return (
                <div key={i} className="flex gap-3 items-center">
                  <div className="flex flex-col items-center shrink-0 w-8">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    {!isLast && (
                      <div className="w-px flex-1 min-h-3 bg-border mt-1" />
                    )}
                  </div>
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
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-md font-medium">활동 내역을 불러오지 못했습니다.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-foreground">
      <Activity className="w-8 h-8" />
      <p className="text-md font-medium">아직 활동 내역이 없어요</p>
      <p className="text-sm font-medium text-muted-foreground">
        콘텐츠에 좋아요를 누르거나 답변·댓글을 작성하면 여기에 기록됩니다.
      </p>
    </div>
  );
}
