"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Share2,
  Download,
  AlertCircle,
  CalendarClock,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  reportsEndpoints,
  REPORT_QUERY_KEYS,
} from "@/lib/api/endpoints/reports";
import { formatWeekLabel, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ReportContent from "./ReportContent";
import { exportReportAsPdf } from "@/lib/report/exportPdf";

export default function WeeklyReportPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: listRes, isLoading: isListLoading } = useQuery({
    queryKey: REPORT_QUERY_KEYS.weeklyList,
    queryFn: () => reportsEndpoints.getWeeklyReportList(),
  });
  const reportList = listRes?.data ?? [];
  const hasReport = listRes !== undefined && reportList.length > 0;

  const {
    data: reportRes,
    isLoading: isReportLoading,
    isError,
  } = useQuery({
    queryKey: selectedReportId
      ? REPORT_QUERY_KEYS.weeklyById(selectedReportId)
      : REPORT_QUERY_KEYS.weekly,
    queryFn: selectedReportId
      ? () => reportsEndpoints.getWeeklyReportById(selectedReportId)
      : () => reportsEndpoints.getWeeklyReport(),
    enabled: hasReport,
  });

  const shareMutation = useMutation({
    mutationFn: (reportId: string) =>
      reportsEndpoints.createWeeklyReportShare(reportId),
    onSuccess: (data) => {
      const token = data.data?.shareToken;
      const shareUrl = `${window.location.origin}/report/share/${token}`;
      navigator.clipboard.writeText(shareUrl).catch(() => {});
      toast.success("공유 링크가 클립보드에 복사되었습니다.");
    },
    onError: () => toast.error("공유 링크 생성에 실패했습니다."),
  });

  const exportMutation = useMutation({
    mutationFn: ({ weekStart }: { weekStart: string }) => {
      console.log("contentRef", contentRef.current);
      if (!contentRef.current)
        return Promise.reject(new Error("저장할 영역을 찾을 수 없습니다"));
      return exportReportAsPdf(contentRef.current, weekStart);
    },
    onSuccess: () => toast.success("리포트가 저장되었습니다. (PDF)"),
    onError: (error) => {
      console.error("PDF export error:", error);
      toast.error("저장에 실패했습니다.");
    },
  });

  if (isListLoading) return <LoadingState />;
  if (!hasReport) return <NoReportState />;
  if (isReportLoading) return <LoadingState />;
  if (isError || !reportRes?.data) return <ErrorState />;

  const report = reportRes.data;
  const activity = report.activities[0];

  return (
    <>
      <div className="space-y-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-gradient-to-b from-[color-mix(in_srgb,var(--report-wash)_55%,white)] to-card px-4 py-4 shadow-[0_1px_0_0_color-mix(in_srgb,var(--report-ink)_6%,transparent)] @sm:flex-row @sm:items-center @sm:justify-between @sm:gap-6 @sm:px-6 @sm:py-5 dark:from-primary/[0.08] dark:to-card dark:shadow-none">
          <WeekHeader
            report={report}
            reportList={reportList}
            selectedReportId={selectedReportId}
            onSelect={setSelectedReportId}
          />
          <div className="flex shrink-0 gap-2.5 @sm:justify-end">
            <button
              onClick={() =>
                exportMutation.mutate({ weekStart: report.weekStart })
              }
              disabled={exportMutation.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/15 bg-card/80 px-4 py-2.5 text-sm font-medium text-report-ink shadow-xs backdrop-blur-md transition-[color,box-shadow,background-color,border-color] hover:border-border hover:bg-muted @sm:flex-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 dark:text-foreground"
              type="button"
            >
              <Download className="h-4 w-4 shrink-0 opacity-80" />
              {exportMutation.isPending ? "저장 중..." : "저장 (PDF)"}
            </button>
            <button
              onClick={() => shareMutation.mutate(report.reportId)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_1px_2px_color-mix(in_srgb,var(--report-ink)_12%,transparent)] transition-[filter,transform] hover:brightness-[1.03] active:scale-[0.99] @sm:flex-none cursor-pointer dark:shadow-md"
              type="button"
            >
              <Share2 className="h-4 w-4 shrink-0 opacity-95" />
              공유
            </button>
          </div>
        </div>

        <ReportContent
          activity={activity}
          chartData={report.chartData}
        />
      </div>
      {/* PDF 저장 전용 영역 */}
      <div className="fixed -left-[99999px] top-0 pointer-events-none">
        <div ref={contentRef} className="w-[900px] bg-white p-8">
          <div className="mb-6">
            <p className="text-xl font-bold">
              {formatWeekLabel(report.weekStart)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(report.weekStart)} ~ {formatDate(report.weekEnd)}
            </p>
          </div>

          <ReportContent
            activity={activity}
            chartData={report.chartData}
          />
        </div>
      </div>
    </>
  );
}

interface WeekHeaderProps {
  report: { reportId: string; weekStart: string; weekEnd: string };
  reportList: {
    reportId: string;
    weekStart: string;
    weekEnd: string;
    status: string;
  }[];
  selectedReportId: string | null;
  onSelect: (id: string) => void;
}

function WeekHeader({
  report,
  reportList,
  selectedReportId,
  onSelect,
}: WeekHeaderProps) {
  const currentId = selectedReportId ?? report.reportId;

  return (
    <div className="min-w-0 space-y-1.5">
      {reportList.length > 1 ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex max-w-full items-center gap-1.5 text-left text-xl font-bold tracking-tight text-report-ink transition-colors hover:text-primary @md:text-2xl cursor-pointer dark:text-report-ink"
              type="button"
            >
              <span className="truncate">
                {formatWeekLabel(report.weekStart)}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-primary/70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {reportList.map((item) => (
              <DropdownMenuItem
                key={item.reportId}
                onClick={() => onSelect(item.reportId)}
                className="flex items-center justify-between gap-6 cursor-pointer"
              >
                <span>{formatWeekLabel(item.weekStart)}</span>
                {item.reportId === currentId && (
                  <Check className="w-4 h-4 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <p className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-2xl">
          {formatWeekLabel(report.weekStart)}
        </p>
      )}
      <p className="text-sm font-medium tabular-nums tracking-tight text-muted-foreground">
        {formatDate(report.weekStart)} — {formatDate(report.weekEnd)}
      </p>
    </div>
  );
}

function NoReportState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/15 bg-[color-mix(in_srgb,var(--report-wash)_35%,transparent)] px-6 py-16 text-foreground dark:bg-primary/[0.06]">
      <CalendarClock className="h-9 w-9 text-primary/80" />
      <p className="text-balance text-base font-semibold text-report-ink">
        아직 생성된 리포트가 없어요
      </p>
      <p className="max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground">
        매주 월요일에 지난 주 학습 리포트가 자동으로 생성됩니다.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-primary/[0.04] px-4 py-4 @sm:flex-row @sm:items-center @sm:justify-between @sm:px-6 @sm:py-5">
        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-primary/10 bg-card p-6 @md:p-8">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-3 @sm:gap-4 @xl:grid-cols-4 @xl:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-muted/80"
            />
          ))}
        </div>
        <div className="h-16 animate-pulse rounded-xl bg-muted/80" />
      </div>

      <div className="space-y-5 rounded-2xl border border-primary/10 bg-[color-mix(in_srgb,var(--report-wash)_25%,transparent)] p-6 @md:p-8 dark:bg-primary/[0.05]">
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-6 @lg:grid-cols-2 @lg:gap-8">
          <div className="h-56 animate-pulse rounded-xl bg-muted/70" />
          <div className="h-56 animate-pulse rounded-xl bg-muted/70" />
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-primary/10 bg-card p-6 @md:p-8">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 @md:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-muted/80"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-foreground">
      <AlertCircle className="h-9 w-9 text-destructive" />
      <p className="text-base font-semibold">리포트를 불러오지 못했습니다.</p>
    </div>
  );
}
