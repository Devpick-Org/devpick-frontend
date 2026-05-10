"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/extractApiError";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { resumeEndpoints } from "@/lib/api/endpoints/resume";
import { exportQAAsPdf } from "@/lib/jobs/exportQAPdf";
import { parseInterviewQaPayload } from "@/lib/jobs/parseInterviewQaPayload";
import type { JobCategory, QACategory } from "@/types/jobs";
import { JOB_CATEGORY_LABEL } from "../main/jobs.constants";
import {
  JobAiProgressSteps,
  useProgressStepTicker,
} from "./JobAiProgressSteps";
import { JobDetailSection } from "./JobDetailSection";
import { JobQACategory } from "./JobQACategory";

interface JobQASectionProps {
  jobId: string;
  companyName?: string;
  jobTitle?: string;
  jobCategory?: JobCategory;
  /** 표시용 (향후 확장) */
  matchScore?: number;
}

function ellipsize(s: string, maxLen: number): string {
  const t = s.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}

function buildInterviewQaSteps(
  companyName: string,
  jobTitle: string,
  categoryLabel: string,
): readonly string[] {
  const co = companyName.trim() || "해당 회사";
  const title = ellipsize(jobTitle.trim() || "이 공고", 36);
  const cat = categoryLabel || "직무";
  return [
    `${co} 「${title}」 공고를 읽고 있어요`,
    `비슷한 ${cat} 직무 공고를 찾고 있어요`,
    `예상 면접 질문과 모범 답변을 작성하고 있어요`,
    `결과를 정리해 저장하고 있어요`,
  ];
}

export function JobQASection({
  jobId,
  companyName = "",
  jobTitle = "",
  jobCategory,
  matchScore: _matchScore = 0,
}: JobQASectionProps) {
  void _matchScore;

  const router = useRouter();
  const qc = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const { data: hasResume } = useQuery({
    queryKey: ["master-resume"],
    queryFn: resumeEndpoints.getMasterOrNull,
    select: (d) => d != null,
    staleTime: 60_000,
  });

  const {
    data: savedCategories,
    isLoading: isLoadingSaved,
    isError: isLoadError,
    refetch,
  } = useQuery({
    queryKey: ["job-interview-qa", jobId],
    queryFn: async (): Promise<QACategory[] | null> => {
      try {
        const r = await jobsEndpoints.getInterviewQa(jobId);
        const parsed = parseInterviewQaPayload(r.payloadJson);
        return parsed.length ? parsed : null;
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) return null;
        if (extractApiError(e).code === "JOB_003") return null;
        throw e;
      }
    },
  });

  const generate = useMutation({
    mutationFn: () => jobsEndpoints.generateInterviewQa(jobId),
    onSuccess: (res) => {
      const cats = parseInterviewQaPayload(res.payloadJson);
      void qc.setQueryData(["job-interview-qa", jobId], cats.length ? cats : null);
      void qc.invalidateQueries({ queryKey: ["interview-qa-list"] });
      toast.success("면접 Q&A가 저장되었습니다.", {
        action: {
          label: "Q&A 보기",
          onClick: () => router.push("/my-resume?tab=qa"),
        },
        actionButtonStyle: {
          backgroundColor: "#16a34a",
          color: "white",
        },
      });
    },
    onError: (e) => {
      const { code, message } = extractApiError(e);
      if (code === "RESUME_001") {
        toast.error("먼저 마스터 이력서를 작성해 주세요.");
        return;
      }
      toast.error(message ?? "면접 Q&A 생성에 실패했습니다.");
    },
  });

  const currentQA: QACategory[] | null = savedCategories ?? null;
  const isGenerated = (currentQA?.length ?? 0) > 0;
  const isLoading = isLoadingSaved || generate.isPending;
  const isError = isLoadError;

  const qaStepLabels = buildInterviewQaSteps(
    companyName,
    jobTitle,
    jobCategory != null ? JOB_CATEGORY_LABEL[jobCategory] : "개발",
  );
  const qaActiveStep = useProgressStepTicker(
    generate.isPending,
    qaStepLabels.length,
    1200,
    jobId,
  );

  const handleDownloadPdf = async () => {
    if (!currentQA?.length) return;
    try {
      setIsExporting(true);
      await exportQAAsPdf(currentQA, jobId);
    } finally {
      setIsExporting(false);
    }
  };

  const sectionAction = isGenerated ? (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => generate.mutate()}
        disabled={isLoading || isExporting || !hasResume}
        className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        재생성하기
      </button>

      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={isLoading || isExporting}
        className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        PDF 다운로드
      </button>

      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        서버에 저장됨
      </span>
    </div>
  ) : undefined;

  return (
    <JobDetailSection
      title="예상 면접 Q&A"
      titleClassName="text-lg"
      action={sectionAction}
    >
      {!hasResume && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            마스터 이력서를 작성하면 이 공고에 맞춤화된 면접 예상 질문과 모범 답변을 생성할 수
            있어요.
          </p>
          <Link
            href="/my-resume"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            이력서 작성하기
          </Link>
        </div>
      )}

      {hasResume && !isGenerated && !isLoading && !isError && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            이 공고를 기반으로 면접 예상 질문과 모범 답변을 생성할 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => generate.mutate()}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            면접 질문 생성하기
          </button>
        </div>
      )}

      {isLoading && !isGenerated && (
        <div className="rounded-lg bg-muted/50 px-4 py-3.5">
          {generate.isPending ? (
            <JobAiProgressSteps labels={qaStepLabels} activeStepIndex={qaActiveStep} />
          ) : (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
              불러오는 중...
            </div>
          )}
        </div>
      )}

      {generate.isError && !isGenerated && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            면접 질문 생성에 실패했습니다. 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => generate.mutate()}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      )}

      {isError && !isGenerated && !generate.isError && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            면접 Q&A를 불러오지 못했습니다. 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      )}

      {isGenerated && currentQA && (
        <div>
          {generate.isPending && (
            <div className="mb-4 rounded-lg bg-muted/50 px-4 py-3.5">
              <JobAiProgressSteps labels={qaStepLabels} activeStepIndex={qaActiveStep} />
            </div>
          )}
          <div className="divide-y divide-border">
            {currentQA.map((category, i) => (
              <JobQACategory key={i} category={category} />
            ))}
          </div>
        </div>
      )}
    </JobDetailSection>
  );
}
