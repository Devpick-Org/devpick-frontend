"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Building2, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, dedupeTags } from "@/lib/utils";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import type { JobCompanyFacetApi } from "@/lib/api/endpoints/jobs";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { useAuthStore } from "@/store/auth.store";

export type TechCompanySearchTab = "tech" | "company";

type SectionTag = { tag: string; count?: number };

function TagSection({
  title,
  tags,
  draft,
  onToggle,
  selectedCount,
}: {
  title: string;
  tags: SectionTag[];
  draft: string[];
  onToggle: (tag: string) => void;
  selectedCount?: number;
}) {
  if (tags.length === 0) return null;
  return (
    <section className="mb-8 last:mb-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h3>
        {selectedCount !== undefined && (
          <p className="text-xs font-medium text-muted-foreground">
            <span className="tabular-nums text-primary">{selectedCount}</span>개 선택됨
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => {
          const on = draft.some((x) => x.toLowerCase() === tag.toLowerCase());
          return (
            <button
              key={`${title}-${tag}`}
              type="button"
              onClick={() => onToggle(tag)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors leading-none cursor-pointer",
                on
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              <span>{tag}</span>
              {count !== undefined && count > 0 ? (
                <span className="text-[10px] font-bold tabular-nums leading-none">
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

function CompanyOption({
  company,
  selected,
  onToggle,
}: {
  company: JobCompanyFacetApi;
  selected: boolean;
  onToggle: (name: string) => void;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = Boolean(company.logoUrl?.trim()) && !logoFailed;
  const initial = (company.name.trim()[0] ?? "회").toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onToggle(company.name)}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all cursor-pointer",
        "border-border bg-card",
      )}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-xs font-bold text-muted-foreground">
        {hasLogo ? (
          <Image
            src={company.logoUrl!}
            alt={company.name}
            fill
            unoptimized
            className="object-cover"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          initial
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-semibold",
            selected ? "text-primary" : "text-foreground",
          )}
        >
          {company.name}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          공고 {company.count}개
        </span>
      </span>
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full border transition-colors",
          selected ? "border-primary bg-primary" : "border-muted-foreground/40",
        )}
      />
    </button>
  );
}

export interface JobTechCompanyPickerProps {
  techStack: string[];
  companyNames: string[];
  onTechStackChange: (next: string[]) => void;
  onCompanyNamesChange: (next: string[]) => void;
  autoFocusSearch?: boolean;
  initialTab?: TechCompanySearchTab;
  hideTabSwitcher?: boolean;
}

export function JobTechCompanyPicker({
  techStack,
  companyNames,
  onTechStackChange,
  onCompanyNamesChange,
  autoFocusSearch = false,
  initialTab = "tech",
  hideTabSwitcher = false,
}: JobTechCompanyPickerProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const loggedIn = Boolean(accessToken);

  const [activeTab, setActiveTab] = useState<TechCompanySearchTab>(initialTab);
  const [q, setQ] = useState("");
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

  const { data: companyFacets = [] } = useQuery({
    queryKey: ["job-companies", 120],
    queryFn: () => jobsEndpoints.listCompanies(120),
    staleTime: 1000 * 60 * 10,
    retry: 1,
    enabled: loggedIn,
  });

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

  const manualTags = useMemo((): SectionTag[] => {
    const knownNames = new Set([
      ...contentFacets.map((f) => f.name.trim().toLowerCase()),
      ...jobFacets.map((f) => f.name.trim().toLowerCase()),
    ]);
    return techStack
      .filter((t) => !knownNames.has(t.toLowerCase()))
      .map((tag) => ({ tag }));
  }, [techStack, contentFacets, jobFacets]);

  const toggle = (tag: string) => {
    const t = tag.trim();
    if (!t) return;
    onTechStackChange(
      techStack.some((x) => x.toLowerCase() === t.toLowerCase())
        ? techStack.filter((x) => x.toLowerCase() !== t.toLowerCase())
        : [...techStack, t],
    );
  };

  const toggleCompany = (name: string) => {
    const t = name.trim();
    if (!t) return;
    onCompanyNamesChange(
      companyNames.some((x) => x.toLowerCase() === t.toLowerCase())
        ? companyNames.filter((x) => x.toLowerCase() !== t.toLowerCase())
        : [...companyNames, t],
    );
  };

  const addManual = () => {
    const t = manual.trim();
    if (!t) return;
    if (techStack.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onTechStackChange([...techStack, t]);
    setManual("");
  };

  const showEmpty =
    activeTab === "tech"
      ? contentSectionTags.length === 0 &&
        !(loggedIn && jobOnlySectionTags.length > 0)
      : companyFacets.length === 0 ||
        companyFacets.every((c) => !c.name.toLowerCase().includes(query));

  const filteredCompanies = useMemo(
    () =>
      companyFacets.filter((company) =>
        query ? company.name.toLowerCase().includes(query) : true,
      ),
    [companyFacets, query],
  );

  const techSelectedCount = techStack.length;
  const companySelectedCount = companyNames.length;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="shrink-0 space-y-3 border-b border-border bg-popover px-4 pb-4 pt-2 sm:px-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus={autoFocusSearch}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              activeTab === "tech"
                ? "기술 스택을 검색해 보세요..."
                : "회사명을 검색해 보세요..."
            }
            className="h-12 rounded-lg bg-muted/60 pl-11 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:!ring-0 focus-visible:!border-border focus-visible:outline-none"
          />
        </div>
        {!hideTabSwitcher && <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
          {[
            { id: "tech" as const, label: "기술 스택", icon: Sparkles },
            { id: "company" as const, label: "회사", icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const on = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setQ("");
                }}
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                  on
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>}
        <p className="pl-3 text-xs leading-relaxed text-muted-foreground">
          {activeTab === "tech"
            ? "기술은 수집 콘텐츠 RDS 태그를 우선 보여 줍니다."
            : "회사는 크롤링된 공고 데이터를 기준으로 검색합니다."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-popover px-4 pb-10 pt-4 sm:px-5">
        {contentFacetError ? (
          <p className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            콘텐츠 태그를 불러오지 못했어요. 새로 고침 후 다시 시도해 보세요.
          </p>
        ) : null}

        {activeTab === "tech" ? (
          <>
            <TagSection
              title="직접 추가"
              tags={manualTags}
              draft={techStack}
              onToggle={toggle}
              selectedCount={manualTags.length > 0 ? techSelectedCount : undefined}
            />
            <TagSection
              title="크롤·수집 콘텐츠 태그"
              tags={contentSectionTags}
              draft={techStack}
              onToggle={toggle}
              selectedCount={manualTags.length === 0 ? techSelectedCount : undefined}
            />

            {loggedIn && jobFacets.length > 0 ? (
              <TagSection
                title="공고 빈도 (참고)"
                tags={jobOnlySectionTags}
                draft={techStack}
                onToggle={toggle}
              />
            ) : null}
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">회사</h3>
              <p className="text-xs font-medium text-muted-foreground">
                <span className="tabular-nums text-primary">{companySelectedCount}</span>개 선택됨
              </p>
            </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {filteredCompanies.map((company) => (
              <CompanyOption
                key={company.name}
                company={company}
                selected={companyNames.some(
                  (x) => x.toLowerCase() === company.name.toLowerCase(),
                )}
                onToggle={toggleCompany}
              />
            ))}
          </div>
          </>
        )}

        {showEmpty ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {query ? "검색 결과가 없어요." : "표시할 태그가 아직 없어요."}
          </p>
        ) : null}
      </div>

      {activeTab === "tech" ? (
        <div className="shrink-0 space-y-2 border-t border-border bg-popover px-4 pb-2 pt-3 sm:px-5">
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
              className="h-9 flex-1 bg-background border border-border text-xs focus-visible:!ring-0 focus-visible:!border-border focus-visible:outline-none"
            />
            <Button type="button" variant="secondary" onClick={addManual}>
              추가
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
