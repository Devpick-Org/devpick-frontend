"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { parseInterviewQaPayload } from "@/lib/jobs/parseInterviewQaPayload";
import { extractApiError } from "@/lib/api/extractApiError";
import type { SavedQA } from "@/lib/mock/resume-qa";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeQAJobList } from "./ResumeQAJobList";
import { ResumeQADetail } from "./ResumeQADetail";

function ResumeQATabSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
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
      <p className="text-sm font-medium">Q&A 목록을 불러오지 못했습니다.</p>
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

function toSavedQA(row: {
  jobId: string;
  companyName: string;
  jobTitle: string;
  matchScore: number;
  payloadJson: string;
  updatedAt: string;
}): SavedQA {
  return {
    jobId: row.jobId,
    companyName: row.companyName,
    jobTitle: row.jobTitle,
    matchScore: row.matchScore,
    qaCategories: parseInterviewQaPayload(row.payloadJson),
    savedAt: row.updatedAt,
  };
}

export function ResumeQATab() {
  const qc = useQueryClient();
  const {
    data: rows,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["interview-qa-list"],
    queryFn: jobsEndpoints.listInterviewQa,
  });

  const savedQAs: SavedQA[] = useMemo(
    () => (rows ?? []).map(toSavedQA).filter((q) => q.qaCategories.length > 0),
    [rows],
  );

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedEffective =
    selectedJobId && savedQAs.some((q) => q.jobId === selectedJobId)
      ? selectedJobId
      : savedQAs[0]?.jobId ?? null;

  const deleteMutation = useMutation({
    mutationFn: (jobId: string) => jobsEndpoints.deleteInterviewQa(jobId),
    onSuccess: (_, jobId) => {
      void qc.invalidateQueries({ queryKey: ["interview-qa-list"] });
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

  const selectedQA =
    savedQAs.find((qa) => qa.jobId === selectedEffective) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ResumeQAJobList
        items={savedQAs}
        selectedJobId={selectedEffective}
        onSelect={setSelectedJobId}
      />
      <ResumeQADetail
        qa={selectedQA}
        onDelete={(jobId) => deleteMutation.mutate(jobId)}
      />
    </div>
  );
}
