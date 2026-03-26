"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Share2,
  Download,
  AlertCircle,
  FileText,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  reportsEndpoints,
  REPORT_QUERY_KEYS,
} from "@/lib/api/endpoints/reports";
import { formatWeekLabel } from "@/lib/utils";
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

  const { data: listRes } = useQuery({
    queryKey: REPORT_QUERY_KEYS.weeklyList,
    queryFn: () => reportsEndpoints.getWeeklyReportList(),
  });
  const reportList = listRes?.data ?? [];

  const {
    data: reportRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: selectedReportId
      ? REPORT_QUERY_KEYS.weeklyById(selectedReportId)
      : REPORT_QUERY_KEYS.weekly,
    queryFn: selectedReportId
      ? () => reportsEndpoints.getWeeklyReportById(selectedReportId)
      : () => reportsEndpoints.getWeeklyReport(),
  });

  const shareMutation = useMutation({
    mutationFn: (reportId: string) =>
      reportsEndpoints.createWeeklyReportShare(reportId),
    onSuccess: (data) => {
      const token = data.data?.shareToken;
      const shareUrl = `${window.location.origin}/report/share/${token}`;
      navigator.clipboard.writeText(shareUrl).catch(() => {});
      toast.success("공유 링크가 클립보드에 복사되었습니다");
    },
    onError: () => toast.error("공유 링크 생성에 실패했습니다"),
  });

  const exportMutation = useMutation({
    mutationFn: ({ weekStart }: { weekStart: string }) => {
      console.log("contentRef", contentRef.current);
      if (!contentRef.current)
        return Promise.reject(new Error("저장할 영역을 찾을 수 없습니다"));
      return exportReportAsPdf(contentRef.current, weekStart);
    },
    onSuccess: () => toast.success("리포트가 저장되었습니다 (PDF)"),
    onError: (error) => {
      console.error("PDF export error:", error);
      toast.error("저장에 실패했습니다");
    },
  });

  if (isLoading) return <LoadingState />;
  if (isError || !reportRes?.data) return <ErrorState />;

  const report = reportRes.data;
  const activity = report.activities[0];

  if (report.status === "EMPTY" || !activity) {
    return (
      <div className="space-y-4 pt-2">
        <WeekHeader
          report={report}
          reportList={reportList}
          selectedReportId={selectedReportId}
          onSelect={setSelectedReportId}
        />
        <EmptyActivityState />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <WeekHeader
            report={report}
            reportList={reportList}
            selectedReportId={selectedReportId}
            onSelect={setSelectedReportId}
          />
          <div className="flex gap-2 shrink-0 sm:mt-0.5">
            <button
              onClick={() =>
                exportMutation.mutate({ weekStart: report.weekStart })
              }
              disabled={exportMutation.isPending}
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 shrink-0" />
              {exportMutation.isPending ? "저장 중..." : "저장 (PDF)"}
            </button>
            <button
              onClick={() => shareMutation.mutate(report.reportId)}
              disabled={shareMutation.isPending}
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              {shareMutation.isPending ? "공유 중..." : "공유"}
            </button>
          </div>
        </div>

        <ReportContent
          activity={activity}
          chartData={report.chartData}
          aiInsight={report.aiInsight}
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
              {report.weekStart} ~ {report.weekEnd}
            </p>
          </div>

          <ReportContent
            activity={activity}
            chartData={report.chartData}
            aiInsight={report.aiInsight}
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
    <div>
      {reportList.length > 1 ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-lg font-semibold hover:text-foreground/80 transition-colors cursor-pointer">
              {formatWeekLabel(report.weekStart)}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
        <p className="font-semibold">{formatWeekLabel(report.weekStart)}</p>
      )}
      <p className="text-sm text-muted-foreground mt-0.5">
        {report.weekStart} ~ {report.weekEnd}
      </p>
    </div>
  );
}

function EmptyActivityState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <FileText className="w-8 h-8" />
      <p className="text-sm font-medium">이번 주 활동 내역이 없습니다</p>
      <p className="text-xs font-medium">
        콘텐츠를 읽거나 질문을 작성하면 리포트가 생성됩니다.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      {/* 헤더: 주차 텍스트 + 날짜 + 버튼 */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1.5">
          <div className="h-5 w-36 bg-muted rounded animate-pulse" />
          <div className="h-4 w-44 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
          <div className="h-9 w-16 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* 섹션 1: 이번 주 활동 요약 */}
      <div className="space-y-4">
        <div className="h-5 w-28 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-16 bg-muted rounded-xl animate-pulse" />
      </div>

      {/* 섹션 2: 활동 분석 */}
      <div className="space-y-4">
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-56 bg-muted rounded-xl animate-pulse" />
          <div className="h-56 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>

      {/* 섹션 3: AI 인사이트 */}
      <div className="space-y-4">
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-foreground">
      <AlertCircle className="w-8 h-8" />
      <p className="text-md font-medium">리포트를 불러오지 못했습니다.</p>
    </div>
  );
}
