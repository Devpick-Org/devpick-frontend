"use client";

import { useState } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import type { SavedQA } from "@/lib/mock/resume-qa";
import { exportQAAsPdf } from "@/lib/jobs/exportQAPdf";
import { ResumeQACategory } from "./ResumeQACategory";

interface ResumeQADetailProps {
  qa: SavedQA | null;
  onDelete: (jobId: string) => void;
}

export function ResumeQADetail({ qa, onDelete }: ResumeQADetailProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!qa) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-border bg-muted/20 text-sm text-muted-foreground font-medium">
        저장된 Q&A를 선택해 주세요
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      await exportQAAsPdf(qa.qaCategories, qa.jobId);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {qa.companyName}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-foreground">
            {qa.jobTitle}
          </h3>
          <p className="mt-1 text-xs font-semibold text-primary">
            매칭 {qa.matchScore}%
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
            onClick={() => onDelete(qa.jobId)}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            삭제
          </button>
        </div>
      </div>

      {/* Q&A 카테고리 */}
      <div className="divide-y divide-border">
        {qa.qaCategories.map((category, i) => (
          <ResumeQACategory key={i} category={category} initialOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}
