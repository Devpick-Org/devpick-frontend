"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { Check, Circle, Pencil, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getResumeCompleteness } from "@/lib/resume/resumeCompleteness";
import type { ResumeData } from "@/types/resume";
import { ResumeDetailEditSection } from "./ResumeDetailEditSection";

interface ResumeSummarySectionProps {
  resume: ResumeData;
  onReuploadFile: (file: File) => void;
  editDraft: ResumeData | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditDraftChange: (next: ResumeData) => void;
  isSaving?: boolean;
  suggestedTechPool?: string[];
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-foreground">{children}</h2>;
}

export function ResumeSummarySection({
  resume,
  onReuploadFile,
  editDraft,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditDraftChange,
  isSaving = false,
  suggestedTechPool = [],
}: ResumeSummarySectionProps) {
  const { fileName, uploadedAt, basicInfo, summary, techStack, careers, projects } =
    resume;
  const completeness = getResumeCompleteness(resume);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const infoCards = [
    { label: "이름", value: basicInfo.name || "미입력" },
    { label: "직무", value: basicInfo.jobTitle || "미입력" },
    { label: "경력", value: `${basicInfo.careerYears}년` },
    { label: "위치", value: basicInfo.location || "미입력" },
  ];

  if (editDraft) {
    return (
      <ResumeDetailEditSection
        draft={editDraft}
        onChange={onEditDraftChange}
        onSave={onSaveEdit}
        onCancel={onCancelEdit}
        isSaving={isSaving}
        suggestedTechPool={suggestedTechPool}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-background px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Master Resume
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-foreground">
                {basicInfo.name ? `${basicInfo.name}님의 이력서` : "마스터 이력서"}
              </h2>
              <p className="mt-2 min-w-0 text-sm font-medium leading-snug text-muted-foreground break-keep xl:whitespace-nowrap">
                공고 매칭, 면접 Q&A, 부족 역량 추천에 쓰이는 기준 정보입니다. 수정하면
                프로필 정보도 저장 시점에 자동으로 최신화됩니다.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 bg-background/80"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                새 파일로 갱신
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={onStartEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
                정보 편집하기
              </Button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onReuploadFile(file);
              e.currentTarget.value = "";
            }}
          />
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_260px] sm:items-start sm:p-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 sm:items-start">
            {infoCards.map((item) => (
              <div
                key={item.label}
                className="flex min-h-0 flex-col gap-0.5 rounded-xl border border-border bg-background px-3 py-2 sm:flex-row sm:items-baseline sm:gap-2 sm:py-2"
              >
                <p className="shrink-0 text-[11px] font-semibold text-muted-foreground sm:min-w-[2rem]">
                  {item.label}
                </p>
                <p className="text-sm font-bold leading-tight text-foreground sm:text-base">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-border bg-muted/25 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-foreground">완성도</p>
              <p className="text-sm font-bold text-primary">
                {completeness.percent}%
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completeness.percent}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {completeness.doneCount}/{completeness.total}개 항목 충족
            </p>
            <ul className="mt-4 space-y-2">
              {completeness.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 text-xs font-medium"
                >
                  {item.done ? (
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={item.done ? "text-foreground" : "text-muted-foreground"}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="border-t border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:px-6">
          {fileName?.trim() ? fileName : "직접 작성한 이력서"} · {formatDate(uploadedAt)} 저장
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionTitle>강점 요약</SectionTitle>
          <p className="mt-2 text-xs text-muted-foreground">
            첫 자기소개와 면접 첫 질문에 바로 쓸 수 있는 핵심 문장입니다.
          </p>
          {summary.trim() ? (
            <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-muted/25 p-4 text-sm leading-relaxed text-foreground/90">
              {summary}
            </p>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              아직 요약이 없습니다. 정보 편집하기에서 3~5문장으로 채워 주세요.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionTitle>기술 스택</SectionTitle>
          <p className="mt-2 text-xs text-muted-foreground">
            공고의 기술 요구사항과 직접 매칭됩니다.
          </p>
          {techStack.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              등록된 기술이 없습니다.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {techStack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionTitle>경력 · 프로젝트</SectionTitle>
            <p className="mt-2 text-xs text-muted-foreground">
              면접 질문과 경험 기반 추천에 쓰이는 구체적인 근거입니다.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onStartEdit}>
            경험 추가하기
          </Button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Career
            </p>
            {careers.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                등록된 경력이 없습니다.
              </p>
            ) : (
              careers.map((career, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {career.company || "회사명 미입력"}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {career.role}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {career.period}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {career.description}
                  </p>
                </article>
              ))
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Project
            </p>
            {projects.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                등록된 프로젝트가 없습니다.
              </p>
            ) : (
              projects.map((project, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {project.name || "프로젝트명 미입력"}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {project.period}
                    </span>
                  </div>
                  {project.role.trim() ? (
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">
                      역할: {project.role}
                    </p>
                  ) : null}
                  {project.techStack.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.techStack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {project.description}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
