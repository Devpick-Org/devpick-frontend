"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FileText, LinkIcon } from "lucide-react";

import { formatDate } from "@/lib/utils";

import {
  reportsEndpoints,
  REPORT_QUERY_KEYS,
} from "@/lib/api/endpoints/reports";
import ReportContent from "./ReportContent";

interface Props {
  token: string;
}

export default function SharedReportPage({ token }: Props) {
  const {
    data: reportRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: REPORT_QUERY_KEYS.sharedByToken(token),
    queryFn: () => reportsEndpoints.getWeeklyReportByShareToken(token),
    retry: 0, // 유효하지 않은 토큰은 재시도 불필요
  });

  if (isLoading) return <LoadingState />;
  if (isError || !reportRes?.data) return <ErrorState />;

  const report = reportRes.data;
  const activity = report.activities[0];

  if (report.status === "EMPTY" || !activity) {
    return (
      <div className="mx-auto max-w-4xl @container space-y-8 px-4 py-12 md:px-6">
        <Header weekStart={report.weekStart} weekEnd={report.weekEnd} />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl @container space-y-10 px-4 py-12 md:px-6">
      <Header weekStart={report.weekStart} weekEnd={report.weekEnd} />
      <ReportContent
        activity={activity}
        chartData={report.chartData}
        aiInsight={report.aiInsight}
      />
    </div>
  );
}

function Header({
  weekStart,
  weekEnd,
}: {
  weekStart: string;
  weekEnd: string;
}) {
  return (
    <header className="space-y-3 border-b border-primary/10 pb-8">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
        공유 리포트
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LinkIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
        <span>공유된 주간 리포트</span>
      </div>
      <h1 className="text-balance text-2xl font-bold tracking-tight text-report-ink @md:text-3xl">
        주간 리포트
      </h1>
      <p className="text-sm font-medium tabular-nums tracking-tight text-muted-foreground">
        {formatDate(weekStart)} — {formatDate(weekEnd)}
      </p>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/15 bg-[color-mix(in_srgb,var(--report-wash)_30%,transparent)] py-20 text-muted-foreground dark:bg-primary/[0.05]">
      <FileText className="h-9 w-9 text-primary/70" />
      <p className="text-pretty text-sm font-semibold text-report-ink">
        활동 내역이 없는 리포트입니다
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-4xl @container space-y-10 px-4 py-12 md:px-6">
      <div className="space-y-3 border-b border-primary/10 pb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3 @sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/80" />
        ))}
      </div>
      <div className="grid gap-4 @md:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl bg-muted/70" />
        <div className="h-56 animate-pulse rounded-xl bg-muted/70" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-foreground">
      <AlertCircle className="h-9 w-9 text-destructive" />
      <p className="text-base font-semibold">리포트를 불러올 수 없습니다</p>
      <p className="text-center text-sm font-medium text-muted-foreground">
        유효하지 않거나 만료된 공유 링크입니다.
      </p>
    </div>
  );
}
