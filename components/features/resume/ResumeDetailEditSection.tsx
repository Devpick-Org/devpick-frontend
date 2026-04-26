"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResumeCareer, ResumeData, ResumeProject } from "@/types/resume";

function emptyCareer(): ResumeCareer {
  return { company: "", role: "", period: "", description: "" };
}

function emptyProject(): ResumeProject {
  return { name: "", period: "", techStack: [], description: "" };
}

interface ResumeDetailEditSectionProps {
  draft: ResumeData;
  onChange: (next: ResumeData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function ResumeDetailEditSection({
  draft,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
}: ResumeDetailEditSectionProps) {
  const [techInput, setTechInput] = useState("");
  const [projTechInputs, setProjTechInputs] = useState<Record<number, string>>(
    {},
  );

  const addTech = () => {
    const t = techInput.trim();
    if (!t || draft.techStack.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setTechInput("");
      return;
    }
    onChange({ ...draft, techStack: [...draft.techStack, t] });
    setTechInput("");
  };

  const removeTech = (tag: string) => {
    onChange({
      ...draft,
      techStack: draft.techStack.filter((x) => x !== tag),
    });
  };

  const setCareers = (careers: ResumeCareer[]) =>
    onChange({ ...draft, careers });

  const setProjects = (projects: ResumeProject[]) =>
    onChange({ ...draft, projects });

  return (
    <div className="flex flex-col gap-8 rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-col gap-2 border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground">
          기술·경력·프로젝트 편집
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          채용 매칭·면접 Q&A에 반영됩니다. 저장 시 서버에 바로 반영돼요.
        </p>
      </div>

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
            <p className="text-xs text-muted-foreground">
              프로젝트가 없습니다. 「행 추가」로 입력해 주세요.
            </p>
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
                    설명
                  </label>
                  <textarea
                    value={p.description}
                    onChange={(e) => {
                      const next = [...draft.projects];
                      next[i] = { ...p, description: e.target.value };
                      setProjects(next);
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
