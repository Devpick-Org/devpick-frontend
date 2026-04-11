"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RotateCcw } from "lucide-react";

import {
  historyEndpoints,
  HISTORY_QUERY_KEYS,
} from "@/lib/api/endpoints/history";
import type { BadgeItem } from "@/types/history";
import { cn } from "@/lib/utils";

export default function BadgePage() {
  const {
    data: pointsRes,
    isLoading: pointsLoading,
    isError: pointsError,
    refetch: refetchPoints,
  } = useQuery({
    queryKey: HISTORY_QUERY_KEYS.points,
    queryFn: () => historyEndpoints.getPointsSummary(),
  });

  const {
    data: badgesRes,
    isLoading: badgesLoading,
    isError: badgesError,
    refetch: refetchBadges,
  } = useQuery({
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
      ) : pointsError ? (
        <SectionError
          message="포인트 정보를 불러오지 못했습니다."
          onRetry={refetchPoints}
        />
      ) : points ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryCard
            label="총 포인트"
            value={`${points.totalPoints}p`}
            highlight
          />
          <SummaryCard
            label="이번 주 획득 포인트"
            value={`${points.weeklyPoints}p`}
          />
          <SummaryCard label="연속 출석" value={`${points.streak}일`} />
        </div>
      ) : null}

      {/* 배지 목록 */}
      {badgesLoading ? (
        <BadgeGridSkeleton />
      ) : badgesError ? (
        <SectionError
          message="배지 정보를 불러오지 못했습니다."
          onRetry={refetchBadges}
        />
      ) : (
        <div className="space-y-12">
          {acquired.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-foreground">
                획득한 배지{" "}
                <span className="text-primary">{acquired.length}</span>
              </h3>
              <BadgeGrid badges={acquired} />
            </div>
          )}

          {unacquired.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-muted-foreground">
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

function SectionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        다시 시도
      </button>
    </div>
  );
}

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
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between sm:flex-col sm:items-center sm:text-center">
      <p className="text-xs font-medium text-muted-foreground sm:mb-2">
        {label}
      </p>
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
      {badges.map((badge) => (
        <div
          key={badge.badgeId}
          className={cn(
            "rounded-xl bg-card px-4 py-4 flex flex-col items-center gap-0 text-center",
            !badge.acquired && "opacity-40",
          )}
        >
          <Image
            src={`/icons/badges/${badge.badgeId}.svg`}
            alt={badge.name}
            width={156}
            height={156}
            className={cn(!badge.acquired && "grayscale")}
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {badge.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {badge.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <p className="text-md font-medium text-foreground">
        아직 획득한 배지가 없습니다.
      </p>
      <p className="text-sm text-muted-foreground">
        학습 활동을 통해 배지를 모아보세요.
      </p>
    </div>
  );
}

function PointsSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          className="rounded-xl bg-card px-4 py-4 flex flex-col items-center gap-0"
        >
          <div className="w-[156px] h-[156px] bg-muted rounded-xl animate-pulse" />
          <div className="space-y-1.5 w-full mt-1">
            <div className="h-3.5 w-2/3 bg-muted rounded animate-pulse mx-auto" />
            <div className="h-3 w-4/5 bg-muted rounded animate-pulse mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
