"use client";

import { useRef } from "react";
import { Upload, Loader2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploadSectionProps {
  isParsing: boolean;
  onFileSelect: (file: File) => void;
  errorMessage?: string | null;
  /** MVP: 파일 파싱 없이 직접 작성 */
  onStartManual?: () => void;
}

export function ResumeUploadSection({
  isParsing,
  onFileSelect,
  errorMessage,
  onStartManual,
}: ResumeUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (isParsing) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card py-20 shadow-sm">
        <div className="rounded-2xl bg-primary/10 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-foreground">
            이력서를 분석하고 있어요
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            기본 정보, 기술 스택, 경력과 프로젝트를 추출하는 중입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_280px] md:p-8">
          <div className="flex min-h-[260px] flex-col justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6 transition-colors group-hover:bg-muted/30">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold tracking-[-0.03em] text-foreground">
              PDF/DOCX 이력서를 여기에 올려주세요
            </p>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-muted-foreground">
              업로드하면 AI가 이름, 직무, 경력, 기술 스택, 프로젝트를 읽어 마스터
              이력서로 정리합니다. 이후 한 화면에서 바로 수정할 수 있어요.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => inputRef.current?.click()}
              >
                <FileText className="h-4 w-4" />
                파일 선택
              </Button>
              {onStartManual && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                  onClick={onStartManual}
                >
                  직접 작성하기
                </Button>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-background/80 p-5">
            <p className="text-sm font-bold text-foreground">업로드 후 자동 정리</p>
            <div className="mt-4 space-y-3 text-sm font-medium text-muted-foreground">
              <p>기본 정보: 이름, 직무, 경력, 위치</p>
              <p>기술 스택: 공고 매칭에 쓰이는 태그</p>
              <p>경력·프로젝트: 면접 Q&A 생성 근거</p>
            </div>
            <div className="mt-6 rounded-xl bg-muted/40 p-3 text-xs font-medium leading-relaxed text-muted-foreground">
              PDF, DOCX · 최대 10MB · HWP는 PDF나 DOCX로 변환 후 올려 주세요.
            </div>
          </aside>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
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
