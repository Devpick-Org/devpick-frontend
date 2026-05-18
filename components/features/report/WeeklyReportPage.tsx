"use client";

import { useState, useRef } from "react";
import { AxiosError } from "axios";
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
import { parsePrevWeekComparisonRaw } from "@/lib/report/formatPrevWeekComparison";
import type { WeeklyActivity } from "@/types/report";

export default function WeeklyReportPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: listRes, isLoading: isListLoading } = useQuery({
    queryKey: REPORT_QUERY_KEYS.weeklyList,
    queryFn: () => reportsEndpoints.getWeeklyReportList(),
  });
  const reportList = listRes?.data ?? [];
  const hasReport = listRes !== undefined && reportList.length > 0;

  /** 목록 최신 순 첫 행 기준 — GET /reports/weekly(직전 주만) 과 목록 불일치로 인한 404 방지 */
  const effectiveReportId =
    selectedReportId ?? reportList[0]?.reportId ?? null;

  const {
    data: reportRes,
    isLoading: isReportLoading,
    isError,
    error,
  } = useQuery({
    queryKey: effectiveReportId
      ? REPORT_QUERY_KEYS.weeklyById(effectiveReportId)
      : (["reports", "weekly", "pending"] as const),
    queryFn: () =>
      reportsEndpoints.getWeeklyReportById(effectiveReportId!),
    enabled: hasReport && effectiveReportId != null,
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
  if (isError || !reportRes?.data) {
    return <ErrorState isNotFound={isWeeklyReportFetchNotFound(error)} />;
  }

  const report = reportRes.data;
  const activity = report.activities[0];

  return (
    <>
      <div className="space-y-10">
        <HeroBand
          report={report}
          reportList={reportList}
          selectedReportId={selectedReportId}
          onSelect={setSelectedReportId}
          activity={activity}
          onExportPdf={() => exportMutation.mutate({ weekStart: report.weekStart })}
          onShare={() => shareMutation.mutate(report.reportId)}
          exportPending={exportMutation.isPending}
        />

        <ReportContent activity={activity} chartData={report.chartData} />
      </div>
      {/* PDF 저장 전용: print 레이아웃. 완전히 화면 바깥 좌표는 캔버스 높이 누락 빈발 → 폭만 -translate 로 밀어냄 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-[-2147483647] flex w-max max-w-none -translate-x-full"
      >
        <div ref={contentRef} className="w-[794px] shrink-0 bg-white p-8 text-foreground">
          <div className="mb-6">
            <p className="text-xl font-bold">{formatWeekLabel(report.weekStart)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(report.weekStart)} ~ {formatDate(report.weekEnd)}
            </p>
          </div>

          <ReportContent activity={activity} chartData={report.chartData} variant="print" />
        </div>
      </div>
    </>
  );
}

interface HeroBandProps {
  report: { reportId: string; weekStart: string; weekEnd: string };
  reportList: {
    reportId: string;
    weekStart: string;
    weekEnd: string;
    status: string;
  }[];
  selectedReportId: string | null;
  onSelect: (id: string) => void;
  activity: WeeklyActivity;
  onExportPdf: () => void;
  onShare: () => void;
  exportPending: boolean;
}

function HeroBand({
  report,
  reportList,
  selectedReportId,
  onSelect,
  activity,
  onExportPdf,
  onShare,
  exportPending,
}: HeroBandProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 @md:p-8 dark:border-border/60">
      <div className="flex flex-col gap-8 @lg:flex-row @lg:items-start @lg:justify-between">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="space-y-1">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
              Weekly report
            </p>
            <WeekHeader
              report={report}
              reportList={reportList}
              selectedReportId={selectedReportId}
              onSelect={onSelect}
            />
          </div>
          <p className="max-w-xl text-sm font-medium leading-relaxed text-muted-foreground">
            읽기·질문·채용 탐색 활동을 한곳에 모았어요. 아래 카드에서 이번 주 흐름을 살펴보세요.
          </p>
          <WeekVsPrevBars activity={activity} />
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 @sm:flex-row @lg:flex-col">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={exportPending}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:pointer-events-none disabled:opacity-50 @lg:flex-none"
          >
            <Download className="h-4 w-4 shrink-0 opacity-80" />
            {exportPending ? "저장 중..." : "저장 (PDF)"}
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-[filter,transform] hover:brightness-[1.03] active:scale-[0.99] @lg:flex-none cursor-pointer"
          >
            <Share2 className="h-4 w-4 shrink-0 opacity-95" />
            공유
          </button>
        </div>
      </div>
    </div>
  );
}

function WeekVsPrevBars({ activity }: { activity: WeeklyActivity }) {
  const prev = parsePrevWeekComparisonRaw(activity.prevWeekComparison);
  if (!prev) {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        전주 비교 데이터가 있으면 활동량을 같은 기준으로 나란히 보여 줍니다.
      </p>
    );
  }

  const rows = [
    { key: "read", label: "읽은 글", cur: activity.contentsRead, prv: prev.contentsRead },
    { key: "q", label: "질문", cur: activity.questionsCreated, prv: prev.questionsCreated },
    { key: "job", label: "확인 공고", cur: activity.jobPostingsViewed, prv: prev.jobPostingsViewed },
  ] as const;

  return (
    <div className="border-t border-border/60 pt-5 dark:border-border/50">
      <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        전주 대비 활동량
      </p>
      <div className="grid grid-cols-1 gap-6 @sm:grid-cols-3 @sm:gap-5">
        {rows.map((row) => {
          const max = Math.max(row.cur, row.prv, 1);
          const curPct = (row.cur / max) * 100;
          const prvPct = (row.prv / max) * 100;
          return (
            <div key={row.key} className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-report-ink">{row.label}</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[10px] font-medium text-muted-foreground">전주</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-muted-foreground/30"
                      style={{ width: `${prvPct}%` }}
                    />
                  </div>
                  <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">{row.prv}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[10px] font-medium text-primary">이번 주</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary/15">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${curPct}%` }}
                    />
                  </div>
                  <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-primary">{row.cur}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
    <div className="min-w-0 space-y-2">
      {reportList.length > 1 ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex max-w-full cursor-pointer items-center gap-1.5 text-left text-2xl font-semibold tracking-tight text-report-ink transition-colors hover:text-primary @md:text-3xl dark:text-report-ink"
              type="button"
            >
              <span className="truncate">{formatWeekLabel(report.weekStart)}</span>
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
        <p className="text-balance text-2xl font-semibold tracking-tight text-report-ink @md:text-3xl">
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
      <div className="rounded-xl border border-border/60 bg-card p-6 @md:p-8 dark:border-border/50">
        <div className="flex flex-col gap-6 @lg:flex-row @lg:justify-between">
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-2.5">
            <div className="h-10 w-28 animate-pulse rounded-xl bg-muted/80" />
            <div className="h-10 w-20 animate-pulse rounded-xl bg-muted/80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start">
        <div className="space-y-10 lg:col-span-2">
          <div className="rounded-xl border border-border/60 bg-card p-6 @md:p-8 dark:border-border/50">
            <div className="mb-6 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-6 w-36 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-4 @xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/75" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6 @md:p-8 dark:border-border/50">
            <div className="mb-6 space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="mb-8 h-48 animate-pulse rounded-xl bg-muted/60" />
            <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-muted/70" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6 @md:p-8 dark:border-border/50">
            <div className="mb-6 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/75" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-border/60 bg-card p-5 dark:border-border/50">
            <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/70" />
              ))}
            </div>
          </div>
          <div className="h-24 animate-pulse rounded-xl border border-border/60 bg-muted/40 dark:border-border/50" />
        </div>
      </div>
    </div>
  );
}

function isWeeklyReportFetchNotFound(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 404;
}

function ErrorState({ isNotFound }: { isNotFound?: boolean }) {
  const title = isNotFound
    ? "해당 주간 리포트를 찾을 수 없습니다."
    : "리포트를 불러오지 못했습니다.";
  const hint = isNotFound
    ? "목록에서 다른 주를 선택하거나 잠시 후 다시 시도해 주세요."
    : null;

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-foreground">
      <AlertCircle className="h-9 w-9 text-destructive" />
      <p className="text-base font-semibold">{title}</p>
      {hint ? (
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
