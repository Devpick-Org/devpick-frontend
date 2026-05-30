"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import type { SavedAnalysisItemApi } from "@/lib/api/endpoints/jobs";
import { parseInterviewQaPayload } from "@/lib/jobs/parseInterviewQaPayload";
import { formatResetsAt } from "@/lib/utils";
import { extractApiError } from "@/lib/api/extractApiError";
import { useAuthStore } from "@/store/auth.store";
import type { SavedQA } from "@/types/jobs";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeQAJobList } from "./ResumeQAJobList";
import { ResumeQADetail } from "./ResumeQADetail";
import { ResumeSkillGapDetail } from "./ResumeSkillGapDetail";

function ResumeQATabSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] w-full rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col gap-5 rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumeQATabError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 text-foreground">
      <AlertCircle className="h-8 w-8" />
      <p className="text-sm font-medium">목록을 불러오지 못했습니다.</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        다시 시도
      </button>
    </div>
  );
}

export function ResumeQATab({
  defaultView = "qa",
  defaultJobId,
}: {
  defaultView?: "qa" | "skillgap";
  defaultJobId?: string;
}) {
  const qc = useQueryClient();
  const qaGenerateLimits = useAuthStore((s) => s.user?.limits?.interviewQaGenerateWeekly);

  const exhausted = qaGenerateLimits?.remaining === 0;
  const unlimited = qaGenerateLimits?.remaining === -1;
  const limitsLabel = (() => {
    if (!qaGenerateLimits) return null;
    if (unlimited) return "면접 Q&A 생성 무제한";
    if (exhausted)
      return `면접 Q&A 생성: 이번 주 횟수를 모두 사용했어요 · ${formatResetsAt(qaGenerateLimits.resetsAt)} 초기화`;
    return `면접 Q&A 생성: 이번 주 ${qaGenerateLimits.remaining}회 남음`;
  })();

  const { data: rows, isLoading, isError, refetch } = useQuery({
    queryKey: ["saved-analysis"],
    queryFn: jobsEndpoints.savedAnalysis,
  });

  const items: SavedAnalysisItemApi[] = useMemo(() => rows ?? [], [rows]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(defaultJobId ?? null);
  const [selectedView, setSelectedView] = useState<"qa" | "skillgap">(defaultView);

  const selectedEffective =
    selectedJobId && items.some((i) => i.jobId === selectedJobId)
      ? selectedJobId
      : items[0]?.jobId ?? null;

  const selectedItem = items.find((i) => i.jobId === selectedEffective) ?? null;

  // 선택된 공고가 현재 view를 지원하지 않으면 지원하는 view로 보정
  const resolvedView = useMemo((): "qa" | "skillgap" => {
    if (!selectedItem) return selectedView;
    if (selectedView === "qa" && !selectedItem.hasInterviewQa && selectedItem.hasSkillGap) return "skillgap";
    if (selectedView === "skillgap" && !selectedItem.hasSkillGap && selectedItem.hasInterviewQa) return "qa";
    return selectedView;
  }, [selectedItem, selectedView]);

  // 선택된 공고의 Q&A 데이터 on-demand fetch
  const { data: qaCategories, isLoading: isQaLoading } = useQuery({
    queryKey: ["job-interview-qa", selectedEffective],
    queryFn: async () => {
      const r = await jobsEndpoints.getInterviewQa(selectedEffective!);
      return parseInterviewQaPayload(r.payloadJson);
    },
    enabled: !!selectedEffective && resolvedView === "qa" && (selectedItem?.hasInterviewQa ?? false),
  });

  const selectedQA: SavedQA | null =
    selectedItem && qaCategories != null
      ? {
          jobId: selectedItem.jobId,
          companyName: selectedItem.companyName,
          jobTitle: selectedItem.jobTitle,
          matchScore: selectedItem.matchScore,
          qaCategories,
          savedAt: selectedItem.updatedAt,
        }
      : null;

  const deleteMutation = useMutation({
    mutationFn: (jobId: string) => jobsEndpoints.deleteInterviewQa(jobId),
    onSuccess: (_, jobId) => {
      void qc.invalidateQueries({ queryKey: ["saved-analysis"] });
      void qc.invalidateQueries({ queryKey: ["job-interview-qa", jobId] });
      toast.success("면접 Q&A가 삭제되었습니다.");
      setSelectedJobId(null);
    },
    onError: (e) => {
      const { message } = extractApiError(e);
      toast.error(message ?? "삭제에 실패했습니다.");
    },
  });

  if (isLoading) return <ResumeQATabSkeleton />;
  if (isError) return <ResumeQATabError onRetry={() => void refetch()} />;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ResumeQAJobList
        items={items}
        selectedJobId={selectedEffective}
        selectedView={resolvedView}
        onSelect={(jobId, view) => {
          setSelectedJobId(jobId);
          setSelectedView(view);
        }}
      />
      {resolvedView === "qa" ? (
        isQaLoading ? (
          <div className="flex items-center gap-2.5 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            불러오는 중...
          </div>
        ) : (
          <ResumeQADetail
            qa={selectedQA}
            onDelete={(jobId) => deleteMutation.mutate(jobId)}
            limitsLabel={limitsLabel}
            exhausted={exhausted}
          />
        )
      ) : (
        <ResumeSkillGapDetail
          jobId={selectedEffective}
          companyName={selectedItem?.companyName ?? ""}
          jobTitle={selectedItem?.jobTitle ?? ""}
          matchScore={selectedItem?.matchScore ?? 0}
        />
      )}
    </div>
  );
}
