"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { JobCategory, ExperienceLevel } from "@/types/jobs";
import {
  JOB_CATEGORY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  LOCATION_OPTIONS,
  TECH_STACK_OPTIONS,
} from "./jobs.constants";

export interface JobFilters {
  category: JobCategory | "ALL";
  experienceLevel: ExperienceLevel | "ALL";
  techStack: string[];
  companyNames: string[];
  location: string | "ALL";
}

export const DEFAULT_JOB_FILTERS: JobFilters = {
  category: "ALL",
  experienceLevel: "ALL",
  techStack: [],
  companyNames: [],
  location: "ALL",
};

interface JobFilterBarProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}

interface FilterTriggerProps {
  label: string;
  active: boolean;
}

const FilterTrigger = React.forwardRef<HTMLButtonElement, FilterTriggerProps>(
  ({ label, active, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30",
      )}
      {...props}
    >
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  ),
);
FilterTrigger.displayName = "FilterTrigger";

export function JobFilterBar({ filters, onChange }: JobFilterBarProps) {
  const categoryLabel =
    filters.category === "ALL"
      ? "직무"
      : (JOB_CATEGORY_OPTIONS.find((o) => o.value === filters.category)
          ?.label ?? "직무");

  const expLabel =
    filters.experienceLevel === "ALL"
      ? "경력"
      : (EXPERIENCE_LEVEL_OPTIONS.find(
          (o) => o.value === filters.experienceLevel,
        )?.label ?? "경력");

  const techLabel =
    filters.techStack.length === 0
      ? "기술스택"
      : filters.techStack.length === 1
        ? filters.techStack[0]
        : `기술스택 ${filters.techStack.length}`;

  const locationLabel = filters.location === "ALL" ? "위치" : filters.location;

  return (
    <div className="flex flex-wrap gap-2">
      {/* 직무 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger
            label={categoryLabel}
            active={filters.category !== "ALL"}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px] p-1">
          <DropdownMenuRadioGroup
            value={filters.category}
            onValueChange={(v) =>
              onChange({ ...filters, category: v as JobCategory | "ALL" })
            }
          >
            {JOB_CATEGORY_OPTIONS.map((opt) => (
              <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 경력 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger
            label={expLabel}
            active={filters.experienceLevel !== "ALL"}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[130px] p-1">
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
              <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 기술스택 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger
            label={techLabel}
            active={filters.techStack.length > 0}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[160px] p-1 max-h-72 overflow-y-auto"
        >
          {filters.techStack.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => onChange({ ...filters, techStack: [] })}
                className="w-full px-3 py-1.5 text-left text-xs text-muted-foreground hover:text-foreground"
              >
                초기화
              </button>
              <DropdownMenuSeparator />
            </>
          )}
          {TECH_STACK_OPTIONS.map((tech) => (
            <DropdownMenuCheckboxItem
              key={tech}
              checked={filters.techStack.includes(tech)}
              onCheckedChange={(checked) => {
                const next = checked
                  ? [...filters.techStack, tech]
                  : filters.techStack.filter((t) => t !== tech);
                onChange({ ...filters, techStack: next });
              }}
            >
              {tech}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 위치 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FilterTrigger
            label={locationLabel}
            active={filters.location !== "ALL"}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px] p-1">
          <DropdownMenuRadioGroup
            value={filters.location}
            onValueChange={(v) => onChange({ ...filters, location: v })}
          >
            <DropdownMenuRadioItem value="ALL">전체</DropdownMenuRadioItem>
            {LOCATION_OPTIONS.map((loc) => (
              <DropdownMenuRadioItem key={loc} value={loc}>
                {loc}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
