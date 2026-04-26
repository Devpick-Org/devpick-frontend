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
  TECH_STACK_OPTIONS,
} from "./jobs.constants";
import type { JobFilters } from "./JobFilterBar";

const POPULAR_TECHS = [
  "React",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "Node.js",
  "Spring Boot",
];

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

  const [techSearch, setTechSearch] = useState("");
  const filteredTechOptions = techSearch.trim()
    ? TECH_STACK_OPTIONS.filter((t) =>
        t.toLowerCase().includes(techSearch.toLowerCase()),
      )
    : TECH_STACK_OPTIONS;

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

      {/* Row 3: 기술 스택 */}
      <div className="p-4">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-sm font-semibold text-muted-foreground shrink-0 mt-1">
            기술 스택
          </p>
          <div className="flex flex-col shrink-0 ml-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="기술 스택 검색..."
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                className="h-7 w-64 rounded-lg bg-muted/60 pl-8 pr-3 text-xs font-medium text-muted-foreground shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
              />
            </div>
            {techSearch.trim() && filteredTechOptions.length === 0 && (
              <div className="mt-3 w-64 space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  프리셋에 없는 이름이에요. 아래를 누르면 그대로 필터에 넣을 수 있어요. (DB
                  태그와 철자가 같을 때만 걸립니다.)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const t = techSearch.trim();
                    const exists = filters.techStack.some(
                      (x) => x.toLowerCase() === t.toLowerCase(),
                    );
                    if (!exists) {
                      onChange({ ...filters, techStack: [...filters.techStack, t] });
                    }
                    setTechSearch("");
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-xs font-semibold text-foreground transition-colors hover:bg-muted/60 cursor-pointer"
                >
                  「{techSearch.trim()}」 필터에 추가
                </button>
              </div>
            )}
          </div>
          {POPULAR_TECHS.map((tech) => {
            const selected = filters.techStack.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => {
                  const next = selected
                    ? filters.techStack.filter((t) => t !== tech)
                    : [...filters.techStack, tech];
                  onChange({ ...filters, techStack: next });
                }}
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium transition-colors cursor-pointer",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {tech}
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="ml-auto text-sm text-muted-foreground font-medium transition-colors hover:text-foreground cursor-pointer shrink-0"
            >
              필터 초기화
            </button>
          )}
        </div>
        {techSearch.trim() && filteredTechOptions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {filteredTechOptions.map((tech) => {
              const selected = filters.techStack.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? filters.techStack.filter((t) => t !== tech)
                      : [...filters.techStack, tech];
                    onChange({ ...filters, techStack: next });
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    selected
                      ? "bg-primary/10 text-primary"
                      : "border border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
