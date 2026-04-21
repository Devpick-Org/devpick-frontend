"use client";

import { useState } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { MOCK_JOB_QA_SETS } from "@/lib/mock/jobs";
import { exportQAAsPdf } from "@/lib/jobs/exportQAPdf";
import type { QACategory } from "@/types/jobs";
import { JobDetailSection } from "./JobDetailSection";
import { JobQACategory } from "./JobQACategory";

// mock: 이력서 등록 여부
const HAS_RESUME = false;

interface JobQASectionProps {
  jobId: string;
}

export function JobQASection({ jobId }: JobQASectionProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentQA, setCurrentQA] = useState<QACategory[]>(MOCK_JOB_QA_SETS[0]);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);

  const generate = async () => {
    setIsLoading(true);
    setIsGenerated(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const nextIdx = (currentSetIdx + 1) % MOCK_JOB_QA_SETS.length;
    setCurrentSetIdx(nextIdx);
    setCurrentQA(MOCK_JOB_QA_SETS[nextIdx]);
    setIsLoading(false);
    setIsGenerated(true);
  };

  const handleDownloadPdf = async () => {
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
        onClick={handleDownloadPdf}
        disabled={isLoading || isExporting}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {isExporting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        PDF 다운로드
      </button>

      <button
        type="button"
        onClick={generate}
        disabled={isLoading || isExporting}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        재생성하기
      </button>
    </div>
  ) : undefined;

  return (
    <JobDetailSection
      title="예상 면접 Q&A"
      titleClassName="text-lg"
      action={sectionAction}
    >
      {!HAS_RESUME && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            이력서를 등록하면 이 공고에 맞춤화된 면접 예상 질문과 모범 답변을
            생성할 수 있어요.
          </p>
          <button
            type="button"
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            이력서 등록하기
          </button>
        </div>
      )}

      {HAS_RESUME && !isGenerated && !isLoading && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            이 공고를 기반으로 면접 예상 질문과 모범 답변을 생성할 수 있어요.
          </p>
          <button
            type="button"
            onClick={generate}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            면접 질문 생성하기
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-4 py-3.5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          면접 질문을 생성하고 있어요...
        </div>
      )}

      {isGenerated && (
        <div className="divide-y divide-border">
          {currentQA.map((category, i) => (
            <JobQACategory key={i} category={category} />
          ))}
        </div>
      )}
    </JobDetailSection>
  );
}
