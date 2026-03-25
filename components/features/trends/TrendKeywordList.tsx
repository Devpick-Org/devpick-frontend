import { cn } from "@/lib/utils";
import { TrendKeywordIcon } from "./TrendKeywordIcon";
import type { RankedKeyword } from "@/types/trends";

interface TrendKeywordListProps {
  keywords: RankedKeyword[];
}

export function TrendKeywordList({ keywords }: TrendKeywordListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {keywords.map(({ keyword, rank, tier }) => (
        <div
          key={keyword}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
        >
          <span
            className={cn(
              "w-6 shrink-0 text-center text-sm font-bold tabular-nums",
              tier === "large"
                ? "text-primary"
                : tier === "medium"
                  ? "text-foreground/70"
                  : "text-muted-foreground",
            )}
          >
            {rank}
          </span>
          <TrendKeywordIcon keyword={keyword} size={24} />
          <span
            className={cn(
              "truncate font-medium",
              tier === "large"
                ? "text-md text-foreground"
                : "text-sm text-foreground/80",
            )}
          >
            {keyword}
          </span>
        </div>
      ))}
    </div>
  );
}
