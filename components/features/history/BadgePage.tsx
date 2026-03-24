"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import {
  historyEndpoints,
  HISTORY_QUERY_KEYS,
} from "@/lib/api/endpoints/history";
import type { BadgeItem } from "@/types/history";
import { BADGE_META } from "./history.constants";
import { cn } from "@/lib/utils";

export default function BadgePage() {
  const { data: pointsRes, isLoading: pointsLoading } = useQuery({
    queryKey: HISTORY_QUERY_KEYS.points,
    queryFn: () => historyEndpoints.getPointsSummary(),
  });

  const { data: badgesRes, isLoading: badgesLoading } = useQuery({
    queryKey: HISTORY_QUERY_KEYS.badges,
    queryFn: () => historyEndpoints.getBadges(),
  });

  const points = pointsRes?.data;
  const badges = badgesRes?.data ?? [];
  const acquired = badges.filter((b) => b.acquired);
  const unacquired = badges.filter((b) => !b.acquired);

  return (
    <div className="space-y-8">
      {/* 포인트 요약 카드 */}
      {pointsLoading ? (
        <PointsSummarySkeleton />
      ) : points ? (
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard
            label="총 포인트"
            value={`${points.totalPoints}p`}
            highlight
          />
          <SummaryCard label="이번 주" value={`${points.weeklyPoints}p`} />
          <SummaryCard label="연속 출석" value={`${points.streak}일`} />
        </div>
      ) : null}

      {/* 배지 목록 */}
      {badgesLoading ? (
        <BadgeGridSkeleton />
      ) : (
        <div className="space-y-6">
          {acquired.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                획득한 배지{" "}
                <span className="text-primary">{acquired.length}</span>
              </h3>
              <BadgeGrid badges={acquired} />
            </div>
          )}

          {unacquired.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                미획득 배지{" "}
                <span className="text-muted-foreground/60">
                  {unacquired.length}
                </span>
              </h3>
              <BadgeGrid badges={unacquired} />
            </div>
          )}

          {badges.length === 0 && <EmptyState />}
        </div>
      )}
    </div>
  );
}

// ── 내부 컴포넌트 ─────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1">
        {icon}
        <p
          className={cn(
            "text-lg font-bold",
            highlight ? "text-primary" : "text-foreground",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function BadgeGrid({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {badges.map((badge) => {
        const meta = BADGE_META[badge.badgeId];
        const Icon = meta.icon;
        return (
          <div
            key={badge.badgeId}
            className={cn(
              "rounded-xl border border-border bg-card px-4 py-4 flex flex-col items-center gap-2 text-center",
              !badge.acquired && "opacity-40",
            )}
          >
            <div
              className={cn(
                "h-11 w-11 rounded-full flex items-center justify-center",
                badge.acquired ? meta.iconBgClass : "bg-muted",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  badge.acquired ? meta.iconClass : "text-muted-foreground",
                )}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {badge.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-sm font-medium">배지 정보를 불러오지 못했습니다.</p>
    </div>
  );
}

function PointsSummarySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card px-4 py-3 text-center"
        >
          <div className="h-3 w-14 bg-muted rounded animate-pulse mx-auto mb-2" />
          <div className="h-6 w-16 bg-muted rounded animate-pulse mx-auto" />
        </div>
      ))}
    </div>
  );
}

function BadgeGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card px-4 py-4 flex flex-col items-center gap-2"
        >
          <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
          <div className="space-y-1.5 w-full">
            <div className="h-3.5 w-3/4 bg-muted rounded animate-pulse mx-auto" />
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
