"use client";

import { useRef } from "react";
import { Upload, Loader2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploadSectionProps {
  isParsing: boolean;
  onFileSelect: (file: File) => void;
  errorMessage?: string | null;
}

export function ResumeUploadSection({
  isParsing,
  onFileSelect,
  errorMessage,
}: ResumeUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (isParsing) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-muted/30 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            이력서를 분석하고 있어요
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            파일을 분석 중입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 transition-colors hover:bg-muted/30"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            이력서 파일을 업로드하세요
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            파일을 이 영역에 드래그하거나 아래 버튼으로 선택하세요
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-muted hover:text-foreground"
          onClick={() => inputRef.current?.click()}
        >
          <FileText className="h-4 w-4" />
          파일 선택
        </Button>

        <p className="text-xs text-muted-foreground font-medium">
          PDF, HWP, HWPX, DOC, DOCX 파일 지원 · 최대 10MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.hwp,.hwpx,.doc,.docx"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {errorMessage && (
        <p className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
