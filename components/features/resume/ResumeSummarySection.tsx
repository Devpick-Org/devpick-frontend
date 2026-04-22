import type { ReactNode } from "react";
import { FileText, RefreshCw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { ResumeData, ResumeBasicInfo } from "@/types/resume";

interface ResumeSummarySectionProps {
  resume: ResumeData;
  onReupload: () => void;
  isEditing: boolean;
  draft: ResumeBasicInfo | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDraftChange: (field: keyof ResumeBasicInfo, value: string | number) => void;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-semibold text-foreground">{children}</h2>;
}

export function ResumeSummarySection({
  resume,
  onReupload,
  isEditing,
  draft,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDraftChange,
}: ResumeSummarySectionProps) {
  const { fileName, uploadedAt, basicInfo, techStack, careers, projects } =
    resume;

  return (
    <div className="flex flex-col gap-8">
      {/* 파일 정보 */}
      <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/45 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {fileName}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">
              {formatDate(uploadedAt)} 업로드
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 hover:bg-muted hover:text-foreground"
          onClick={onReupload}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          재업로드
        </Button>
      </div>

      {/* 추출된 정보 */}
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">추출된 정보</h2>
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">
              이력서에서 자동으로 분석된 내용입니다.
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={onStartEdit}
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
              기본 정보 수정
            </button>
          )}
        </div>

        {/* 기본 정보 */}
        <section className="flex flex-col gap-3">
          <SectionTitle>기본 정보</SectionTitle>
          {isEditing && draft ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    이름
                  </label>
                  <Input
                    value={draft.name}
                    onChange={(e) => onDraftChange("name", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    직무
                  </label>
                  <Input
                    value={draft.jobTitle}
                    onChange={(e) => onDraftChange("jobTitle", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    경력 (년)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.careerYears}
                    onChange={(e) =>
                      onDraftChange("careerYears", Number(e.target.value))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    위치
                  </label>
                  <Input
                    value={draft.location}
                    onChange={(e) => onDraftChange("location", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 hover:bg-muted hover:text-foreground"
                  onClick={onCancelEdit}
                >
                  취소
                </Button>
                <Button size="sm" className="gap-1.5" onClick={onSave}>
                  저장
                </Button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
              {[
                { label: "이름", value: basicInfo.name },
                { label: "직무", value: basicInfo.jobTitle },
                { label: "경력", value: `${basicInfo.careerYears}년` },
                { label: "위치", value: basicInfo.location },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 기술 스택 */}
        <section className="flex flex-col gap-3">
          <SectionTitle>기술 스택</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* 경력 */}
        <section className="flex flex-col gap-3">
          <SectionTitle>경력</SectionTitle>
          <ul className="flex flex-col gap-4">
            {careers.map((career, i) => (
              <li
                key={i}
                className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {career.company}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {career.role}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {career.period}
                </span>
                <p className="mt-1 text-sm text-foreground/80">
                  {career.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 프로젝트 */}
        <section className="flex flex-col gap-3">
          <SectionTitle>프로젝트</SectionTitle>
          <ul className="flex flex-col gap-4">
            {projects.map((project, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 border-l-2 border-border pl-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {project.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {project.period}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-foreground/80">
                  {project.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
