"use client";

import * as React from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Briefcase,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { JobCategory, ExperienceLevel } from "@/types/jobs";
import {
  JOB_CATEGORY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  LOCATION_OPTIONS,
} from "./jobs.constants";
import type { JobFilters } from "./JobFilterBar";
import { JobTechStackFilterModal } from "./JobTechStackFilterModal";

// ─── FilterCell ───────────────────────────────────────────────────────────────

interface FilterCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  value: string;
  active: boolean;
}

const FilterCell = React.forwardRef<HTMLButtonElement, FilterCellProps>(
  (
    { icon: Icon, iconClassName, label, value, active, className, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40 cursor-pointer",
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground",
          iconClassName,
        )}
      />
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p
        className={cn(
          "ml-auto truncate text-sm font-semibold",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {value}
      </p>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </button>
  ),
);
FilterCell.displayName = "FilterCell";

// ─── JobSearchPanel ───────────────────────────────────────────────────────────

interface JobSearchPanelProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function JobSearchPanel({
  searchQuery,
  onSearch,
  filters,
  onChange,
  hasActiveFilters,
  onReset,
}: JobSearchPanelProps) {
  const categoryLabel =
    filters.category === "ALL"
      ? "전체"
      : (JOB_CATEGORY_OPTIONS.find((o) => o.value === filters.category)
          ?.label ?? "전체");

  const expLabel =
    filters.experienceLevel === "ALL"
      ? "전체"
      : (EXPERIENCE_LEVEL_OPTIONS.find(
          (o) => o.value === filters.experienceLevel,
        )?.label ?? "전체");

  const locationLabel = filters.location === "ALL" ? "전체" : filters.location;

  const [techModalOpen, setTechModalOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Row 1: 검색 */}
      <div className="relative border-b border-border">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="채용 공고, 회사명, 기술 스택으로 검색..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="h-14 border-0 bg-transparent pl-13 pr-5 text-base font-medium shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
        />
      </div>

      {/* Row 2: 직무 / 경력 / 근무지 */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {/* 직무 */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <FilterCell
              icon={Briefcase}
              label="직무"
              value={categoryLabel}
              active={filters.category !== "ALL"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[160px] p-1">
            <DropdownMenuRadioGroup
              value={filters.category}
              onValueChange={(v) =>
                onChange({ ...filters, category: v as JobCategory | "ALL" })
              }
            >
              {JOB_CATEGORY_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 경력 */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <FilterCell
              icon={GraduationCap}
              iconClassName="h-5 w-5"
              label="경력"
              value={expLabel}
              active={filters.experienceLevel !== "ALL"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[140px] p-1">
            <DropdownMenuRadioGroup
              value={filters.experienceLevel}
              onValueChange={(v) =>
                onChange({
                  ...filters,
                  experienceLevel: v as ExperienceLevel | "ALL",
                })
              }
            >
              {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 근무지 */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <FilterCell
              icon={MapPin}
              label="근무지"
              value={locationLabel}
              active={filters.location !== "ALL"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[180px] p-1">
            <DropdownMenuRadioGroup
              value={filters.location}
              onValueChange={(v) => onChange({ ...filters, location: v })}
            >
              <DropdownMenuRadioItem value="ALL" className="cursor-pointer">
                전체
              </DropdownMenuRadioItem>
              {LOCATION_OPTIONS.map((loc) => (
                <DropdownMenuRadioItem
                  key={loc}
                  value={loc}
                  className="cursor-pointer"
                >
                  {loc}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 3: 기술 스택 — 모달에서 RDS 수집 태그 기준 선택 */}
      <div className="p-4">
        <div className="flex flex-wrap items-start gap-3">
          <p className="text-sm font-semibold text-muted-foreground shrink-0 pt-2.5">
            기술 스택
          </p>
          <div className="min-w-0 flex-1 space-y-2">
            <button
              type="button"
              onClick={() => setTechModalOpen(true)}
              className={cn(
                "relative flex min-h-9 w-full max-w-md items-center rounded-lg border border-transparent bg-muted/60 px-3 py-2 text-left text-xs font-medium transition-colors",
                "cursor-pointer hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-haspopup="dialog"
            >
              <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span
                className={cn(
                  "truncate",
                  filters.techStack.length
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {filters.techStack.length
                  ? `기술 ${filters.techStack.length}개${
                      filters.companyNames.length
                        ? ` · 회사 ${filters.companyNames.length}개`
                        : ""
                    } 선택됨`
                  : filters.companyNames.length
                    ? `회사 ${filters.companyNames.length}개 선택됨`
                    : "기술 스택·회사 검색..."}
              </span>
            </button>
            {filters.techStack.length > 0 || filters.companyNames.length > 0 ? (
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
            ) : null}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="ml-auto shrink-0 self-start pt-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              필터 초기화
            </button>
          )}
        </div>
        <JobTechStackFilterModal
          open={techModalOpen}
          onOpenChange={setTechModalOpen}
          value={filters.techStack}
          companyNames={filters.companyNames}
          onApply={(next) =>
            onChange({
              ...filters,
              techStack: next.techStack,
              companyNames: next.companyNames,
            })
          }
        />
      </div>
    </div>
  );
}
