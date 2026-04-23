"use client";

import { cn } from "@/lib/utils";
import type { TrendRange } from "@/lib/mock/home-search-trend";

const TABS: { value: TrendRange; label: string }[] = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
];

interface HomeRangeTabsProps {
  range: TrendRange;
  onChange: (range: TrendRange) => void;
  dateLabel: string;
  /** 외부에서 좌우 패딩 등 레이아웃을 제어할 때 사용 */
  className?: string;
}

export function HomeRangeTabs({ range, onChange, dateLabel, className }: HomeRangeTabsProps) {
  return (
    <div className={cn("flex shrink-0 items-center justify-between py-2.5", className)}>
      <span className="text-xs text-muted-foreground">{dateLabel || " "}</span>
      <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              range === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
