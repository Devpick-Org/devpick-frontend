"use client";

import * as React from "react";
import { ListFilter, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  JOB_CATEGORY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  locationFilterLabel,
} from "./jobs.constants";
import type { JobFilters } from "./JobFilterBar";
import { JobUnifiedFilterModal } from "./JobUnifiedFilterModal";

function countStructuredFilters(f: JobFilters): number {
  let n = 0;
  if (f.category !== "ALL") n++;
  if (f.experienceLevel !== "ALL") n++;
  if (f.location !== "ALL") n++;
  n += f.techStack.length + f.companyNames.length;
  return n;
}

function structuredFilterHint(f: JobFilters): string {
  const bits: string[] = [];
  if (f.category !== "ALL") {
    bits.push(
      JOB_CATEGORY_OPTIONS.find((o) => o.value === f.category)?.label ?? "직무",
    );
  }
  if (f.experienceLevel !== "ALL") {
    bits.push(
      EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === f.experienceLevel)?.label ??
        "경력",
    );
  }
  if (f.location !== "ALL") bits.push(locationFilterLabel(f.location));
  const tagParts: string[] = [];
  if (f.techStack.length) tagParts.push(`기술 ${f.techStack.length}`);
  if (f.companyNames.length) tagParts.push(`회사 ${f.companyNames.length}`);
  if (tagParts.length) bits.push(tagParts.join(" · "));
  return bits.length > 0
    ? bits.join(" · ")
    : "필터에서 직무, 경력, 근무지, 태그·회사를 설정할 수 있어요.";
}

interface JobSearchPanelProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
  onLoginRequired?: () => void;
}

export function JobSearchPanel({
  searchQuery,
  onSearch,
  filters,
  onChange,
  hasActiveFilters,
  onReset,
  onLoginRequired,
}: JobSearchPanelProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterRemount, setFilterRemount] = useState(0);
  const activeCount = countStructuredFilters(filters);

  const openFilterModal = () => {
    if (onLoginRequired) {
      onLoginRequired();
      return;
    }
    setFilterRemount((n) => n + 1);
    setFilterOpen(true);
  };

  const handleSearch = (query: string) => {
    if (onLoginRequired) {
      onLoginRequired();
      return;
    }
    onSearch(query);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative border-b border-border">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="채용 공고, 회사명, 기술 스택으로 검색..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-14 border-0 bg-transparent pl-13 pr-5 text-base font-medium shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-wrap items-start gap-3 p-4 sm:gap-4">
        <button
          type="button"
          onClick={openFilterModal}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeCount > 0
              ? "border-transparent bg-primary/8 text-primary shadow-sm"
              : "border-transparent bg-muted/60 text-foreground hover:bg-muted/80",
          )}
          aria-haspopup="dialog"
        >
          <ListFilter className="h-4 w-4 shrink-0" />
          <span>필터</span>
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold tabular-nums text-primary">
              {activeCount}
            </span>
          ) : null}
        </button>

        <p className="min-w-0 flex-1 pt-3 text-sm leading-relaxed text-muted-foreground">
          {structuredFilterHint(filters)}
        </p>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 self-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            필터 초기화
          </button>
        ) : null}
      </div>

      {(filters.techStack.length > 0 || filters.companyNames.length > 0) && (
        <div className="border-t border-border px-4 pb-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            선택한 태그 · 회사
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filters.techStack.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    techStack: filters.techStack.filter((t) => t !== tech),
                  })
                }
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {tech} ×
              </button>
            ))}
            {filters.companyNames.map((company) => (
              <button
                key={company}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    companyNames: filters.companyNames.filter(
                      (name) => name !== company,
                    ),
                  })
                }
                className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                {company} ×
              </button>
            ))}
          </div>
        </div>
      )}

      <JobUnifiedFilterModal
        open={filterOpen}
        remountSignal={filterRemount}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={onChange}
      />
    </div>
  );
}
