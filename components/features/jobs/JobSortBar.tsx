"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { JobSortBy } from "@/lib/mock/jobs";

const SORT_OPTIONS: { value: JobSortBy; label: string }[] = [
  { value: "MATCH", label: "매칭순" },
  { value: "LATEST", label: "최신순" },
  { value: "DEADLINE", label: "마감임박순" },
];

interface JobSortBarProps {
  totalCount: number;
  sortBy: JobSortBy;
  onSortChange: (sort: JobSortBy) => void;
}

export function JobSortBar({
  totalCount,
  sortBy,
  onSortChange,
}: JobSortBarProps) {
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "매칭순";

  return (
    <div className="flex items-center justify-between px-5">
      <p className="text-sm text-muted-foreground font-medium">
        총 <span className="font-semibold text-foreground">{totalCount}</span>개
        공고
      </p>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {currentLabel}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px] p-1">
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(v) => onSortChange(v as JobSortBy)}
          >
            {SORT_OPTIONS.map((opt) => (
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
    </div>
  );
}
