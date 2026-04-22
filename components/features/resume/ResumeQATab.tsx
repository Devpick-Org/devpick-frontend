"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getSavedQAs, removeQA } from "@/lib/mock/resume-qa";
import type { SavedQA } from "@/lib/mock/resume-qa";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeQAJobList } from "./ResumeQAJobList";
import { ResumeQADetail } from "./ResumeQADetail";

const MOCK_QA_LOADING = false;
const MOCK_QA_ERROR = false;

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

export function ResumeQATab() {
  // TODO: API 연동 시 useQuery로 교체 — isLoading/isError를 useQuery 값으로 교체하면 됨
  const [isLoading, setIsLoading] = useState(MOCK_QA_LOADING);
  const [isError, setIsError] = useState(MOCK_QA_ERROR);
  const [savedQAs, setSavedQAs] = useState<SavedQA[]>(() =>
    !MOCK_QA_LOADING && !MOCK_QA_ERROR ? getSavedQAs() : []
  );
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    if (MOCK_QA_LOADING || MOCK_QA_ERROR) return null;
    return getSavedQAs()[0]?.jobId ?? null;
  });

  useEffect(() => {
    if (!MOCK_QA_LOADING) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      const data = getSavedQAs();
      setSavedQAs(data);
      setSelectedJobId(data[0]?.jobId ?? null);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const load = () => {
    setIsError(false);
    const data = getSavedQAs();
    setSavedQAs(data);
    setSelectedJobId(data[0]?.jobId ?? null);
  };

  const handleDelete = (jobId: string) => {
    removeQA(jobId);
    const updated = getSavedQAs();
    setSavedQAs(updated);
    if (selectedJobId === jobId) {
      setSelectedJobId(updated[0]?.jobId ?? null);
    }
    toast.success("면접 Q&A가 삭제되었습니다.");
  };

  if (isLoading) return <ResumeQATabSkeleton />;
  if (isError) return <ResumeQATabError onRetry={load} />;

  const selectedQA = savedQAs.find((qa) => qa.jobId === selectedJobId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ResumeQAJobList
        items={savedQAs}
        selectedJobId={selectedJobId}
        onSelect={setSelectedJobId}
      />
      <ResumeQADetail qa={selectedQA} onDelete={handleDelete} />
    </div>
  );
}
