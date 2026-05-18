"use client";

import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TechTagPickerModal } from "@/components/features/profile/TechTagPickerModal";
import { filterNewSuggestions } from "@/lib/resume/skillSuggestions";
import {
  suggestExampleProject,
  suggestProjectDescription,
  suggestProjectRoleAchievements,
  suggestResumeSummary,
} from "@/lib/resume/resumeDraftSuggestions";
import type { ResumeCareer, ResumeData, ResumeProject } from "@/types/resume";
import { dedupeTags } from "@/lib/utils";

type SuggestionPreview =
  | { kind: "summary"; text: string }
  | { kind: "projectDesc"; index: number; text: string }
  | {
      kind: "projectRole";
      index: number;
      role: string;
      achievements: string;
    };

function emptyCareer(): ResumeCareer {
  return { company: "", role: "", period: "", description: "" };
}

function emptyProject(): ResumeProject {
  return {
    name: "",
    period: "",
    role: "",
    techStack: [],
    description: "",
    achievements: "",
  };
}

interface ResumeDetailEditSectionProps {
  draft: ResumeData;
  onChange: (next: ResumeData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  suggestedTechPool?: string[];
}

export function ResumeDetailEditSection({
  draft,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
  suggestedTechPool = [],
}: ResumeDetailEditSectionProps) {
  const [techPickerOpen, setTechPickerOpen] = useState(false);
  const [projTechInputs, setProjTechInputs] = useState<Record<number, string>>(
    {},
  );
  const [suggestionPreview, setSuggestionPreview] =
    useState<SuggestionPreview | null>(null);

  const clearPreviewIfStale = (next: ResumeData) => {
    setSuggestionPreview((prev) => {
      if (!prev) return null;
      if (prev.kind === "summary") return prev;
      if (prev.index >= next.projects.length) return null;
      return prev;
    });
  };

  const applyDraftChange = (next: ResumeData) => {
    clearPreviewIfStale(next);
    onChange(next);
  };

  const removeTech = (tag: string) => {
    applyDraftChange({
      ...draft,
      techStack: draft.techStack.filter((x) => x !== tag),
    });
  };

  const suggestedToShow = filterNewSuggestions(
    suggestedTechPool,
    draft.techStack,
  ).slice(0, 16);

  const addSuggested = (tag: string) => {
    const t = tag.trim();
    if (!t || draft.techStack.some((x) => x.toLowerCase() === t.toLowerCase()))
      return;
    applyDraftChange({ ...draft, techStack: [...draft.techStack, t] });
  };

  const setCareers = (careers: ResumeCareer[]) =>
    applyDraftChange({ ...draft, careers });

  const setProjects = (projects: ResumeProject[]) =>
    applyDraftChange({ ...draft, projects });

  const setBasicInfo = (
    field: keyof ResumeData["basicInfo"],
    value: string | number,
  ) =>
    applyDraftChange({
      ...draft,
      basicInfo: { ...draft.basicInfo, [field]: value },
    });

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-4">
        <h3 className="text-lg font-bold tracking-[-0.01em] text-foreground">
          이력서 정보 편집
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          기본 정보부터 기술·경력·프로젝트까지 한 번에 수정합니다. 저장하면
          프로필 정보도 이력서 기준으로 자동 최신화됩니다.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-background p-4">
        <span className="text-sm font-semibold text-foreground">기본 정보</span>
        <p className="mt-1 text-xs text-muted-foreground">
          공고 매칭과 면접 Q&A의 기준이 되는 정보입니다.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              이름
            </label>
            <Input
              value={draft.basicInfo.name}
              onChange={(e) => setBasicInfo("name", e.target.value)}
              className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              직무
            </label>
            <Input
              value={draft.basicInfo.jobTitle}
              onChange={(e) => setBasicInfo("jobTitle", e.target.value)}
              className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              경력 (년)
            </label>
            <Input
              type="number"
              min={0}
              value={draft.basicInfo.careerYears}
              onChange={(e) =>
                setBasicInfo("careerYears", Number(e.target.value))
              }
              className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              위치
            </label>
            <Input
              value={draft.basicInfo.location}
              onChange={(e) => setBasicInfo("location", e.target.value)}
              className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
            />
          </div>
        </div>
      </section>

      {/* 자기소개 */}
      <section className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4">
        <span className="text-sm font-semibold text-foreground">
          자기소개·요약
        </span>
        <p className="text-xs text-muted-foreground">
          3~5문장 정도로 강점·관심 분야를 적어 주세요. 면접 Q&A의 자기소개
          질문에 활용됩니다. 완성도는 40자 이상일 때 충족됩니다.
        </p>
        {draft.summary.trim().length < 40 ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() =>
                setSuggestionPreview({
                  kind: "summary",
                  text: suggestResumeSummary(draft),
                })
              }
            >
              <Sparkles className="h-3.5 w-3.5" />
              추천 요약 만들기
            </Button>
            <span className="text-xs text-muted-foreground">
              직무·기술·이름 기반 로컬 초안입니다. 적용 전에 꼭 수정하세요.
            </span>
          </div>
        ) : null}
        {suggestionPreview?.kind === "summary" ? (
          <div className="rounded-lg bg-primary/6 p-3">
            <p className="text-xs font-semibold text-foreground">미리보기</p>
            <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
              {suggestionPreview.text}
            </p>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs hover:bg-muted hover:text-foreground"
                onClick={() => setSuggestionPreview(null)}
              >
                취소
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  applyDraftChange({
                    ...draft,
                    summary: suggestionPreview.text,
                  });
                  setSuggestionPreview(null);
                }}
              >
                적용
              </Button>
            </div>
          </div>
        ) : null}
        <textarea
          value={draft.summary}
          onChange={(e) => {
            setSuggestionPreview((p) => (p?.kind === "summary" ? null : p));
            onChange({ ...draft, summary: e.target.value });
          }}
          rows={5}
          placeholder="예: OO 기술 스택으로 서비스를 만들며, 사용자 경험과 운영 안정성을 모두 고려하는 백엔드 개발자입니다."
          className="min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border"
        />
        <p className="text-[11px] text-muted-foreground">
          {draft.summary.trim().length}자 · 완성도 기준 40자 이상
        </p>
      </section>

      {/* 기술 스택 */}
      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4">
        <span className="text-sm font-semibold text-foreground">기술 스택</span>
        <div className="flex flex-wrap gap-2">
          {draft.techStack.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTech(tag)}
                className="cursor-pointer rounded-full p-0.5"
                aria-label={`${tag} 제거`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setTechPickerOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" />
            추가
          </button>
        </div>
        {suggestedToShow.length > 0 ? (
          <div className="mt-2 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              추천 (프로필·직무 기반) — 클릭 시 추가
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedToShow.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addSuggested(tag)}
                  className="cursor-pointer rounded-full border border-dashed border-primary/40 bg-background px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <TechTagPickerModal
          open={techPickerOpen}
          onOpenChange={setTechPickerOpen}
          value={draft.techStack}
          onApply={(tags) =>
            applyDraftChange({
              ...draft,
              techStack: dedupeTags(tags),
            })
          }
          title="기술 스택 선택"
        />
      </section>

      {/* 경력 */}
      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">경력</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hover:bg-muted hover:text-foreground"
            onClick={() => setCareers([...draft.careers, emptyCareer()])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />행 추가
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {draft.careers.length === 0 ? (
            <p className="-mt-3 text-sm text-muted-foreground">
              경력 항목이 없습니다. 「행 추가」로 입력해 주세요.
            </p>
          ) : null}
          {draft.careers.map((c, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-2 rounded-xl border border-border p-3"
            >
              <button
                type="button"
                className="absolute right-3 top-3 cursor-pointer text-xs text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setCareers(draft.careers.filter((_, j) => j !== i))
                }
              >
                삭제
              </button>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    회사
                  </label>
                  <Input
                    value={c.company}
                    onChange={(e) => {
                      const next = [...draft.careers];
                      next[i] = { ...c, company: e.target.value };
                      setCareers(next);
                    }}
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    역할
                  </label>
                  <Input
                    value={c.role}
                    onChange={(e) => {
                      const next = [...draft.careers];
                      next[i] = { ...c, role: e.target.value };
                      setCareers(next);
                    }}
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    기간
                  </label>
                  <Input
                    value={c.period}
                    onChange={(e) => {
                      const next = [...draft.careers];
                      next[i] = { ...c, period: e.target.value };
                      setCareers(next);
                    }}
                    placeholder="예: 2022.03 ~ 2024.01"
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    설명
                  </label>
                  <textarea
                    value={c.description}
                    onChange={(e) => {
                      const next = [...draft.careers];
                      next[i] = { ...c, description: e.target.value };
                      setCareers(next);
                    }}
                    rows={3}
                    className="min-h-[72px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 프로젝트 */}
      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            프로젝트
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hover:bg-muted hover:text-foreground"
            onClick={() => setProjects([...draft.projects, emptyProject()])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />행 추가
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {draft.projects.length === 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                프로젝트가 없습니다. 「행 추가」로 직접 입력하거나, 아래에서
                예시 한 건을 넣을 수 있어요.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-fit gap-1 text-xs"
                onClick={() =>
                  setProjects([...draft.projects, suggestExampleProject(draft)])
                }
              >
                <Sparkles className="h-3.5 w-3.5" />
                프로젝트 예시 추가
              </Button>
            </div>
          ) : null}
          {draft.projects.map((p, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-2 rounded-xl border border-border p-3"
            >
              <button
                type="button"
                className="absolute right-3 top-3 cursor-pointer text-xs text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setProjects(draft.projects.filter((_, j) => j !== i))
                }
              >
                삭제
              </button>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    프로젝트명
                  </label>
                  <Input
                    value={p.name}
                    onChange={(e) => {
                      const next = [...draft.projects];
                      next[i] = { ...p, name: e.target.value };
                      setProjects(next);
                    }}
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    기간
                  </label>
                  <Input
                    value={p.period}
                    onChange={(e) => {
                      const next = [...draft.projects];
                      next[i] = { ...p, period: e.target.value };
                      setProjects(next);
                    }}
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    본인 역할
                  </label>
                  {(!p.role.trim() || !p.achievements.trim()) && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() =>
                          setSuggestionPreview({
                            kind: "projectRole",
                            index: i,
                            ...suggestProjectRoleAchievements(draft, i),
                          })
                        }
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        역할·성과 문장 추천
                      </Button>
                    </div>
                  )}
                  {suggestionPreview?.kind === "projectRole" &&
                  suggestionPreview.index === i ? (
                    <div className="rounded-lg bg-primary/6 p-3">
                      <p className="text-xs font-semibold text-foreground">
                        미리보기
                      </p>
                      <p className="mt-2 text-xs font-medium text-foreground/90">
                        역할
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        {suggestionPreview.role}
                      </p>
                      <p className="mt-2 text-xs font-medium text-foreground/90">
                        성과
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/90">
                        {suggestionPreview.achievements}
                      </p>
                      <div className="mt-3 flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs hover:bg-muted hover:text-foreground"
                          onClick={() => setSuggestionPreview(null)}
                        >
                          취소
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            const next = [...draft.projects];
                            next[i] = {
                              ...p,
                              role: suggestionPreview.role,
                              achievements: suggestionPreview.achievements,
                            };
                            setProjects(next);
                            setSuggestionPreview(null);
                          }}
                        >
                          적용
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  <Input
                    value={p.role}
                    onChange={(e) => {
                      setSuggestionPreview((prev) =>
                        prev?.kind === "projectRole" && prev.index === i
                          ? null
                          : prev,
                      );
                      const next = [...draft.projects];
                      next[i] = { ...p, role: e.target.value };
                      setProjects(next);
                    }}
                    placeholder="예: 백엔드 담당, 인프라 설계"
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    성과·문제 해결
                  </label>
                  <textarea
                    value={p.achievements}
                    onChange={(e) => {
                      setSuggestionPreview((prev) =>
                        prev?.kind === "projectRole" && prev.index === i
                          ? null
                          : prev,
                      );
                      const next = [...draft.projects];
                      next[i] = { ...p, achievements: e.target.value };
                      setProjects(next);
                    }}
                    rows={2}
                    placeholder="예: 응답 시간 40% 개선, 장애 0건 유지"
                    className="min-h-[56px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    사용 기술
                  </span>
                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.techStack.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                        >
                          {tag}
                          <button
                            type="button"
                            className="cursor-pointer rounded-full p-0.5"
                            onClick={() => {
                              const next = [...draft.projects];
                              next[i] = {
                                ...p,
                                techStack: p.techStack.filter((t) => t !== tag),
                              };
                              setProjects(next);
                            }}
                            aria-label={`${tag} 제거`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <Input
                    value={projTechInputs[i] ?? ""}
                    onChange={(e) =>
                      setProjTechInputs((prev) => ({
                        ...prev,
                        [i]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const raw = (projTechInputs[i] ?? "").trim();
                        if (
                          !raw ||
                          p.techStack.some(
                            (x) => x.toLowerCase() === raw.toLowerCase(),
                          )
                        ) {
                          setProjTechInputs((prev) => ({ ...prev, [i]: "" }));
                          return;
                        }
                        const next = [...draft.projects];
                        next[i] = {
                          ...p,
                          techStack: [...p.techStack, raw],
                        };
                        setProjects(next);
                        setProjTechInputs((prev) => ({ ...prev, [i]: "" }));
                      }
                    }}
                    placeholder="기술 입력 후 Enter"
                    className="h-9 border border-border text-sm focus-visible:!ring-0 focus-visible:!border-border"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    간단 설명
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    무엇을 만들었는지, 어떤 기술로 풀었는지 적어 주세요. 면접
                    질문 품질에 큰 영향을 줍니다. 완성도는 100자 이상 한 항목이
                    있으면 충족됩니다.
                  </p>
                  {p.description.trim().length < 100 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-fit gap-1 text-xs"
                      onClick={() =>
                        setSuggestionPreview({
                          kind: "projectDesc",
                          index: i,
                          text: suggestProjectDescription(draft, i),
                        })
                      }
                    >
                      <Sparkles className="h-3 w-3" />
                      설명 초안 추천
                    </Button>
                  ) : null}
                  {suggestionPreview?.kind === "projectDesc" &&
                  suggestionPreview.index === i ? (
                    <div className="rounded-lg bg-primary/6 p-3">
                      <p className="text-xs font-semibold text-foreground">
                        미리보기
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                        {suggestionPreview.text}
                      </p>
                      <div className="mt-3 flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs hover:bg-muted hover:text-foreground"
                          onClick={() => setSuggestionPreview(null)}
                        >
                          취소
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            const next = [...draft.projects];
                            next[i] = {
                              ...p,
                              description: suggestionPreview.text,
                            };
                            setProjects(next);
                            setSuggestionPreview(null);
                          }}
                        >
                          적용
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  <textarea
                    value={p.description}
                    onChange={(e) => {
                      setSuggestionPreview((prev) =>
                        prev?.kind === "projectDesc" && prev.index === i
                          ? null
                          : prev,
                      );
                      const next = [...draft.projects];
                      next[i] = { ...p, description: e.target.value };
                      setProjects(next);
                    }}
                    rows={3}
                    className="min-h-[72px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {p.description.trim().length}자 · 완성도 기준 100자 이상
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hover:bg-muted hover:text-foreground"
          onClick={onCancel}
          disabled={isSaving}
        >
          취소
        </Button>
        <Button type="button" size="sm" onClick={onSave} disabled={isSaving}>
          저장하기
        </Button>
      </div>
    </div>
  );
}
