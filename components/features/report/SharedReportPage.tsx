"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FileText, LinkIcon } from "lucide-react";

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
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <Header weekStart={report.weekStart} weekEnd={report.weekEnd} />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
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
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <LinkIcon className="w-3 h-3" />
        <span>공유된 주간 리포트</span>
      </div>
      <h1 className="text-2xl font-bold">주간 리포트</h1>
      <p className="text-sm text-muted-foreground">
        {weekStart} ~ {weekEnd}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
      <FileText className="w-8 h-8" />
      <p className="text-sm font-medium">활동 내역이 없는 리포트입니다</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-7 w-36 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-56 bg-muted rounded-xl animate-pulse" />
        <div className="h-56 bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-md font-medium">리포트를 불러올 수 없습니다</p>
      <p className="text-sm font-medium">
        유효하지 않거나 만료된 공유 링크입니다.
      </p>
    </div>
  );
}
