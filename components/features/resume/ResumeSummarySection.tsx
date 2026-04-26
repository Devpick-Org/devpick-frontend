import type { ReactNode } from "react";
import { FileText, RefreshCw, Pencil, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { ResumeData, ResumeBasicInfo } from "@/types/resume";
import { ResumeDetailEditSection } from "./ResumeDetailEditSection";

interface ResumeSummarySectionProps {
  resume: ResumeData;
  onReupload: () => void;
  isEditing: boolean;
  draft: ResumeBasicInfo | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDraftChange: (field: keyof ResumeBasicInfo, value: string | number) => void;
  isSaving?: boolean;
  /** 프로필(닉네임·직무·레벨·관심 태그) → 이력서 반영 */
  onApplyProfile?: () => void;
  showApplyProfile?: boolean;
  /** 기술·경력·프로젝트 상세 편집 */
  detailDraft: ResumeData | null;
  onStartDetailEdit: () => void;
  onCancelDetailEdit: () => void;
  onSaveDetail: () => void;
  onDetailDraftChange: (next: ResumeData) => void;
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
  isSaving = false,
  onApplyProfile,
  showApplyProfile = false,
  detailDraft,
  onStartDetailEdit,
  onCancelDetailEdit,
  onSaveDetail,
  onDetailDraftChange,
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
              {fileName?.trim() ? fileName : "마스터 이력서 (직접 작성)"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">
              {formatDate(uploadedAt)} 저장
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
            <h2 className="text-base font-bold text-foreground">기본 정보</h2>
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">
              채용 매칭·면접 Q&A에 사용되는 마스터 이력서입니다.
            </p>
          </div>
          {!isEditing && !detailDraft && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {showApplyProfile && onApplyProfile ? (
                <button
                  type="button"
                  onClick={onApplyProfile}
                  disabled={isSaving}
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  프로필 반영
                </button>
              ) : null}
              <button
                type="button"
                onClick={onStartEdit}
                className="flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
                기본 정보 수정
              </button>
            </div>
          )}
        </div>

        {/* 기본 정보 필드 */}
        <section className="flex flex-col gap-3">
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
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={onSave}
                  disabled={isSaving}
                >
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

        {/* 기술·경력·프로젝트 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle>기술 스택 · 경력 · 프로젝트</SectionTitle>
            {!detailDraft && !isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={onStartDetailEdit}
              >
                상세 편집
              </Button>
            ) : null}
          </div>

          {detailDraft ? (
            <ResumeDetailEditSection
              draft={detailDraft}
              onChange={onDetailDraftChange}
              onSave={onSaveDetail}
              onCancel={onCancelDetailEdit}
              isSaving={isSaving}
            />
          ) : (
            <>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  기술 스택
                </p>
                {techStack.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    등록된 기술이 없습니다. 「상세 편집」에서 추가해 주세요.
                  </p>
                ) : (
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
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  경력
                </p>
                {careers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    등록된 경력이 없습니다. 「상세 편집」에서 추가해 주세요.
                  </p>
                ) : (
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
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  프로젝트
                </p>
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    등록된 프로젝트가 없습니다. 「상세 편집」에서 추가해 주세요.
                  </p>
                ) : (
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
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
