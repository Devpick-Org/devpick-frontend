"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, dedupeTags } from "@/lib/utils";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { useAuthStore } from "@/store/auth.store";

interface JobTechStackFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string[];
  onApply: (next: string[]) => void;
}

type SectionTag = { tag: string; count?: number };

function TagSection({
  title,
  tags,
  draft,
  onToggle,
}: {
  title: string;
  tags: SectionTag[];
  draft: string[];
  onToggle: (tag: string) => void;
}) {
  if (tags.length === 0) return null;
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => {
          const on = draft.some((x) => x.toLowerCase() === tag.toLowerCase());
          return (
            <button
              key={`${title}-${tag}`}
              type="button"
              onClick={() => onToggle(tag)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                on
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary text-foreground hover:border-primary/40",
              )}
            >
              <span>{tag}</span>
              {count !== undefined && count > 0 ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                    on
                      ? "bg-primary/15 text-primary"
                      : "bg-background text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

type BodyProps = Omit<JobTechStackFilterModalProps, "open">;

function ModalBody({ onOpenChange, value, onApply }: BodyProps) {
  const titleId = useId();
  const accessToken = useAuthStore((s) => s.accessToken);
  const loggedIn = Boolean(accessToken);

  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<string[]>(() => dedupeTags([...value]));
  const [manual, setManual] = useState("");

  const { data: contentFacets = [], isError: contentFacetError } = useQuery({
    queryKey: ["content-tag-facets", 120],
    queryFn: () => contentsEndpoints.listTagFacets(120),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const { data: jobFacets = [] } = useQuery({
    queryKey: ["job-tech-tags", 80],
    queryFn: () => jobsEndpoints.listTechTags(80),
    staleTime: 1000 * 60 * 10,
    retry: 1,
    enabled: loggedIn,
  });

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onOpenChange]);

  const query = q.trim().toLowerCase();

  const countsByContentFacet = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of contentFacets) {
      m.set(f.name.toLowerCase(), f.count);
    }
    return m;
  }, [contentFacets]);

  const mergedJobFacetNames = useMemo(
    () =>
      dedupeTags(
        jobFacets.map((f) => f.name.trim()).filter(Boolean),
      ).slice(0, 56),
    [jobFacets],
  );

  const contentSectionTags = useMemo((): SectionTag[] => {
    const list = dedupeTags(
      contentFacets.map((f) => f.name.trim()).filter(Boolean),
    ).map((tag) => ({
      tag,
      count: countsByContentFacet.get(tag.toLowerCase()),
    }));
    return query
      ? list.filter((x) => x.tag.toLowerCase().includes(query))
      : list;
  }, [contentFacets, countsByContentFacet, query]);

  const jobOnlySectionTags = useMemo((): SectionTag[] => {
    const contentNames = new Set(
      contentFacets.map((f) => f.name.trim().toLowerCase()),
    );
    return mergedJobFacetNames
      .filter((t) => !contentNames.has(t.toLowerCase()))
      .map((tag) => ({
        tag,
        count: jobFacets.find((jf) => jf.name.trim() === tag)?.count,
      }))
      .filter((x) => (query ? x.tag.toLowerCase().includes(query) : true));
  }, [mergedJobFacetNames, contentFacets, jobFacets, query]);

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
    setDraft((prev) =>
      prev.some((x) => x.toLowerCase() === t.toLowerCase())
        ? prev
        : [...prev, t],
    );
    setManual("");
  };

  const showEmpty =
    contentSectionTags.length === 0 &&
    !(loggedIn && jobOnlySectionTags.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 animate-in fade-in-0 duration-200"
      aria-hidden={false}
    >
      <button
        type="button"
        className="absolute inset-0 z-40 cursor-default bg-black/50 outline-none ring-0"
        aria-label="모달 닫기"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-8 z-50 flex w-[calc(100%-32px)] max-w-[600px]",
          "-translate-x-1/2",
          "max-h-[min(620px,calc(100vh-64px))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl",
          "animate-in fade-in-0 zoom-in-[0.985] duration-200",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="relative border-b border-border px-4 pt-3 pb-2 sm:px-5">
          <div className="flex items-start justify-between gap-2">
            <h2 id={titleId} className="sr-only">
              기술 스택 선택
            </h2>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="관심 주제나 기술을 검색해 보세요…"
                className="h-12 rounded-xl border-muted bg-muted/40 pl-10 pr-3 text-[15px] shadow-none placeholder:text-muted-foreground/65 focus-visible:ring-2"
              />
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => onOpenChange(false)}
              className="mt-0.5 shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            수집된 기술 글 RDS 태그를 기준으로 골라요. 로그인하면 채용 공고에 자주
            등장하는 스킬도 함께 보여 줍니다.
          </p>
        </header>

        <div className="mx-5 mt-2 flex shrink-0 items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            선택{" "}
            <span className="font-semibold tabular-nums text-primary">
              {draft.length}
            </span>
            개
          </span>
          {draft.length > 0 ? (
            <div className="flex max-w-[70%] flex-wrap justify-end gap-1">
              {draft.slice(0, 12).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggle(tag)}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary/15"
                >
                  {tag} ×
                </button>
              ))}
              {draft.length > 12 ? (
                <span className="self-center px-1 text-[11px]">
                  +{draft.length - 12}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {contentFacetError ? (
            <p className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              콘텐츠 태그를 불러오지 못했어요. 새로 고침 후 다시 시도해 보세요.
            </p>
          ) : null}

          <TagSection
            title="크롤·수집 콘텐츠 태그"
            tags={contentSectionTags}
            draft={draft}
            onToggle={toggle}
          />

          {loggedIn && jobFacets.length > 0 ? (
            <TagSection
              title="공고 빈도 (참고)"
              tags={jobOnlySectionTags}
              draft={draft}
              onToggle={toggle}
            />
          ) : null}

          {showEmpty ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {query ? "검색 결과가 없어요." : "표시할 태그가 아직 없어요."}
            </p>
          ) : null}
        </div>

        <footer className="space-y-2 border-t border-border bg-muted/20 px-4 py-4 sm:px-5">
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
              placeholder="목록에 없으면 이름을 직접 입력해 추가"
              className="h-10 flex-1 bg-background"
            />
            <Button type="button" variant="secondary" onClick={addManual}>
              추가
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 font-semibold"
              onClick={() => setDraft([])}
            >
              초기화
            </Button>
            <Button
              type="button"
              className="h-11 font-semibold shadow-sm"
              onClick={() => {
                onApply(dedupeTags(draft));
                onOpenChange(false);
              }}
            >
              검색 적용
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function JobTechStackFilterModal({
  open,
  ...rest
}: JobTechStackFilterModalProps) {
  if (!open) return null;
  const mountKey = `${rest.value.slice().sort().join("\u0001")}`;
  return <ModalBody key={mountKey} {...rest} />;
}
