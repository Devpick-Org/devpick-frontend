"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, dedupeTags } from "@/lib/utils";
import { TAG_GROUPS } from "./constants";

interface TechTagPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 현재 선택 (모달 열 때 기준) */
  value: string[];
  onApply: (next: string[]) => void;
  title?: string;
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

type BodyProps = Omit<TechTagPickerModalProps, "open">;

function TechTagPickerBody({
  onOpenChange,
  value,
  onApply,
  title = "기술 스택 선택",
}: BodyProps) {
  const titleId = useId();
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<string[]>(() => dedupeTags([...value]));
  const [manual, setManual] = useState("");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onOpenChange]);

  const query = q.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    return TAG_GROUPS.map((g) => ({
      ...g,
      tags: query
        ? g.tags.filter((t) => t.toLowerCase().includes(query))
        : g.tags,
    })).filter((g) => g.tags.length > 0);
  }, [query]);

  const toggle = (tag: string) => {
    const t = tag.trim();
    if (!t) return;
    setDraft((prev) =>
      prev.some((x) => x.toLowerCase() === t.toLowerCase())
        ? prev.filter((x) => x.toLowerCase() !== t.toLowerCase())
        : [...prev, t],
    );
  };

  const addManual = () => {
    const t = manual.trim();
    if (!t) return;
    if (draft.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setManual("");
      return;
    }
    setDraft((prev) => [...prev, t]);
    setManual("");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
      onClick={() => onOpenChange(false)}
      aria-hidden
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "max-h-[min(560px,calc(100vh-48px))] flex flex-col overflow-hidden rounded-xl",
          "border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            검색 후 태그를 눌러 선택·해제하세요. 목록에 없으면 아래 입력으로 추가할 수
            있습니다.
          </p>
          <div className="relative mt-3">
            <SearchGlyph className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예: kafka, graphql, terraform…"
              className="h-10 bg-secondary pl-9"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-[11px] font-medium text-muted-foreground">
            선택됨{" "}
            <span className="text-primary tabular-nums">{draft.length}</span>개
          </p>
          <div className="space-y-5">
            {filteredGroups.map((group) => (
              <section key={group.label} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => {
                    const on = draft.some(
                      (x) => x.toLowerCase() === tag.toLowerCase(),
                    );
                    return (
                      <button
                        key={`${group.label}-${tag}`}
                        type="button"
                        onClick={() => toggle(tag)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-foreground hover:border-primary/40",
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
            {filteredGroups.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                검색 결과가 없습니다. 아래에서 직접 추가해 보세요.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 border-t border-border bg-muted/20 px-5 py-4">
          <div className="flex gap-2">
            <Input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addManual();
                }
              }}
              placeholder="목록에 없는 기술 직접 입력"
              className="h-9 flex-1 bg-background"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addManual}>
              추가
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onApply(dedupeTags(draft));
                onOpenChange(false);
              }}
            >
              적용
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechTagPickerModal({
  open,
  ...rest
}: TechTagPickerModalProps) {
  if (!open) return null;

  const mountKey =
    `${rest.value.slice().sort().join("\u0001")}:${rest.title ?? ""}`;

  return <TechTagPickerBody key={mountKey} {...rest} />;
}
