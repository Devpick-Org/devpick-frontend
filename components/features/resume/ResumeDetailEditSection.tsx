"use client";

import { useState } from "react";
import { Plus, Sparkles, Trash2 } from "lucide-react";
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
  /** 프로필 태그 + 직무 기반 추천 (이미 보유 스택 제외) */
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
  const [techInput, setTechInput] = useState("");
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

  const addTech = () => {
    const t = techInput.trim();
    if (!t || draft.techStack.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setTechInput("");
      return;
    }
    applyDraftChange({ ...draft, techStack: [...draft.techStack, t] });
    setTechInput("");
  };

  const removeTech = (tag: string) => {
    applyDraftChange({
      ...draft,
      techStack: draft.techStack.filter((x) => x !== tag),
    });
  };

  const setCareers = (careers: ResumeCareer[]) =>
    applyDraftChange({ ...draft, careers });

  const setProjects = (projects: ResumeProject[]) =>
    applyDraftChange({ ...draft, projects });

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

  return (
    <div className="flex flex-col gap-8 rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-col gap-2 border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground">
          기술·경력·프로젝트 편집
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          이력서가 자세할수록 공고 매칭, 면접 질문, 부족 역량 추천이 정확해집니다.
          자동 반영된 값은 언제든 수정할 수 있어요.
        </p>
      </div>

      {/* 자기소개 */}
      <section className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-foreground">
          자기소개·요약
        </span>
        <p className="text-xs text-muted-foreground">
          3~5문장 정도로 강점·관심 분야를 적어 주세요. 면접 Q&A의 자기소개
          질문에 활용됩니다. 완성도는 40자 이상일 때 충족됩니다.
        </p>
        {draft.summary.trim().length < 40 ? (
          <div className="flex flex-wrap items-center gap-2">
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
            <span className="text-[11px] text-muted-foreground">
              직무·기술·이름 기반 로컬 초안입니다. 적용 전에 꼭 수정하세요.
            </span>
          </div>
        ) : null}
        {suggestionPreview?.kind === "summary" ? (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-foreground">미리보기</p>
            <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
              {suggestionPreview.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setSuggestionPreview(null)}
              >
                취소
              </Button>
            </div>
          </div>
        ) : null}
        <textarea
          value={draft.summary}
          onChange={(e) => {
            setSuggestionPreview((p) =>
              p?.kind === "summary" ? null : p,
            );
            onChange({ ...draft, summary: e.target.value });
          }}
          rows={5}
          placeholder="예: OO 기술 스택으로 서비스를 만들며, 사용자 경험과 운영 안정성을 모두 고려하는 백엔드 개발자입니다."
          className="min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-[11px] text-muted-foreground">
          {draft.summary.trim().length}자 · 완성도 기준 40자 이상
        </p>
      </section>

      {/* 기술 스택 */}
      <section className="flex flex-col gap-3">
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
                className="rounded-full p-0.5 hover:bg-primary/20"
                aria-label={`${tag} 제거`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-9"
            onClick={() => setTechPickerOpen(true)}
          >
            목록에서 검색·선택
          </Button>
          <span className="text-[11px] text-muted-foreground">
            검색해서 고르거나, 아래 입력으로 직접 추가하세요.
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="예: Spring Boot"
            className="h-9 max-w-xs text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={addTech}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            추가
          </Button>
        </div>
        {suggestedToShow.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              추천 (프로필·직무 기반) — 클릭 시 추가
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedToShow.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addSuggested(tag)}
                  className="rounded-full border border-dashed border-primary/40 bg-background px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
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
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">경력</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCareers([...draft.careers, emptyCareer()])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            행 추가
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {draft.careers.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              경력 항목이 없습니다. 「행 추가」로 입력해 주세요.
            </p>
          ) : null}
          {draft.careers.map((c, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setCareers(draft.careers.filter((_, j) => j !== i))
                  }
                >
                  삭제
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
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
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
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
                    className="h-8 text-sm"
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
                    className="h-8 text-sm"
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
                    className="min-h-[72px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 프로젝트 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">프로젝트</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setProjects([...draft.projects, emptyProject()])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            행 추가
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {draft.projects.length === 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                프로젝트가 없습니다. 「행 추가」로 직접 입력하거나, 아래에서 예시
                한 건을 넣을 수 있어요.
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
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setProjects(draft.projects.filter((_, j) => j !== i))
                  }
                >
                  삭제
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
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
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
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
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    본인 역할
                  </label>
                  {(!p.role.trim() || !p.achievements.trim()) && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1 text-[11px]"
                        onClick={() =>
                          setSuggestionPreview({
                            kind: "projectRole",
                            index: i,
                            ...suggestProjectRoleAchievements(draft, i),
                          })
                        }
                      >
                        <Sparkles className="h-3 w-3" />
                        역할·성과 문장 추천
                      </Button>
                    </div>
                  )}
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
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    사용 기술
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
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
                  <div className="flex gap-2">
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
                      className="h-8 max-w-xs text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
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
                      className="mb-1 h-7 w-fit gap-1 text-[11px]"
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
                    <div className="mb-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
                      <p className="text-xs font-semibold text-foreground">
                        설명 미리보기
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                        {suggestionPreview.text}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setSuggestionPreview(null)}
                        >
                          취소
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
                    className="min-h-[72px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {p.description.trim().length}자 · 완성도 기준 100자 이상
                  </p>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    성과·문제 해결
                  </label>
                  {suggestionPreview?.kind === "projectRole" &&
                  suggestionPreview.index === i ? (
                    <div className="mb-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
                      <p className="text-xs font-semibold text-foreground">
                        역할·성과 미리보기
                      </p>
                      <p className="mt-1 text-xs font-medium text-foreground/90">
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
                      <div className="mt-3 flex flex-wrap gap-2">
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setSuggestionPreview(null)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : null}
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
                    className="min-h-[56px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          취소
        </Button>
        <Button type="button" size="sm" onClick={onSave} disabled={isSaving}>
          상세 저장
        </Button>
      </div>
    </div>
  );
}
