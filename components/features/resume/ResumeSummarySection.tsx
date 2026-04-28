import type { ReactNode } from "react";
import { Check, Circle, FileText, RefreshCw, Pencil, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { getResumeCompleteness } from "@/lib/resume/resumeCompleteness";
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
  /** 프로필 태그 + 직무 기반 기술 추천 풀 */
  suggestedTechPool?: string[];
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
  suggestedTechPool = [],
}: ResumeSummarySectionProps) {
  const { fileName, uploadedAt, basicInfo, summary, techStack, careers, projects } =
    resume;
  const completeness = getResumeCompleteness(resume);

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

      {/* 완성도 */}
      <div className="rounded-xl border border-border bg-card px-4 py-3.5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold text-foreground">이력서 완성도</span>
          <span className="text-xs font-semibold text-primary">
            {completeness.doneCount}/{completeness.total} · {completeness.percent}%
          </span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          프로필 정보로 기본값을 채우고, 아래 체크리스트를 채우면 공고 매칭·면접 Q&A
          품질이 올라갑니다. 「상세 편집」에서 추천 초안을 켜고 수정해 적용할 수
          있어요.
        </p>
        <ul className="mb-3 flex flex-col gap-1.5 border-b border-border pb-3">
          {completeness.items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 text-xs font-medium text-foreground"
            >
              {item.done ? (
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              ) : (
                <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
        {completeness.items.some((i) => !i.done) ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">먼저 보완하면 좋은 항목</p>
            <div className="flex flex-col gap-2">
              {completeness.items
                .filter((item) => !item.done)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-amber-500/35 bg-amber-500/5 px-3 py-2.5 dark:bg-amber-500/10"
                  >
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    {!detailDraft && !isEditing ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 h-8 text-xs"
                        onClick={
                          item.fixAction === "basic"
                            ? onStartEdit
                            : onStartDetailEdit
                        }
                      >
                        {item.actionLabel}
                      </Button>
                    ) : null}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-xs font-medium text-primary">모든 항목을 충족했습니다.</p>
        )}
      </div>

      {/* 추출된 정보 */}
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">기본 정보</h2>
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">
              공고 매칭, 면접 Q&A, 부족 역량 추천에 사용됩니다. 프로필 반영은
              비어 있는 항목 위주로 채웁니다.
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

        {/* 강점 요약 (읽기 전용 — 상세 편집에서 수정) */}
        {!detailDraft ? (
          <section className="flex flex-col gap-2">
            <SectionTitle>강점 요약</SectionTitle>
            <p className="text-xs text-muted-foreground">
              자기소개·한 줄 소개에 가깝게, 면접 첫 질문에 바로 쓸 수 있게
              적어 두면 좋아요. (완성도: 40자 이상)
            </p>
            {summary.trim() ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {summary}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                아직 요약이 없습니다. 「상세 편집」에서 작성하거나 추천 초안을
                적용해 보세요.
              </p>
            )}
          </section>
        ) : null}

        {/* 기술 · 경력 · 프로젝트 */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
            <div className="min-w-0 flex-1">
              <SectionTitle>기술 · 경력 · 프로젝트</SectionTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">기술</span>은
                공고 스킬 매칭에,{" "}
                <span className="font-medium text-foreground/80">
                  경력·프로젝트
                </span>
                는 면접 질문·경험 추출에 쓰입니다.
              </p>
            </div>
            {!detailDraft && !isEditing ? (
              <Button
                type="button"
                variant="default"
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
              suggestedTechPool={suggestedTechPool}
            />
          ) : (
            <>
              <div>
                <SectionTitle>기술</SectionTitle>
                {techStack.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    등록된 기술이 없습니다. 「상세 편집」에서 추가해 주세요.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
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
                <SectionTitle>경력·프로젝트</SectionTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  경력과 프로젝트 중 한쪽이라도 구체적으로 채우면 완성도의
                  「경험」 항목에 도움이 됩니다.
                </p>
                <p className="mb-2 mt-3 text-xs font-medium text-muted-foreground">
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

                <p className="mb-2 mt-5 text-xs font-medium text-muted-foreground">
                  프로젝트
                </p>
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    등록된 프로젝트가 없습니다. 「상세 편집」에서 추가하거나
                    예시 프로젝트를 넣을 수 있어요.
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
                        {project.role.trim() ? (
                          <p className="text-xs font-medium text-muted-foreground">
                            역할: {project.role}
                          </p>
                        ) : null}
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
                        {project.achievements.trim() ? (
                          <p className="text-sm text-foreground/80">
                            <span className="font-semibold text-foreground">
                              성과:{" "}
                            </span>
                            {project.achievements}
                          </p>
                        ) : null}
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
