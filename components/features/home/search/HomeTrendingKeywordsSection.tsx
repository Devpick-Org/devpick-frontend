"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { TrendKeywordItem, TrendKeywordState } from "@/types/search";

interface HomeTrendingKeywordsSectionProps {
  keywords: TrendKeywordItem[];
  isLoading: boolean;
  rangeLabel: string;
  onKeywordClick: (keyword: string) => void;
}

function DeltaBadge({
  state,
  rankChange,
}: {
  state: TrendKeywordState;
  rankChange: number;
}) {
  if (state === "new") {
    return (
      <span className="text-[10px] font-bold leading-none text-red-500">
        NEW
      </span>
    );
  }
  if (state === "up" && rankChange) {
    return (
      <span className="text-[10px] font-bold leading-none text-red-500">
        ▲{rankChange}
      </span>
    );
  }
  if (state === "down" && rankChange) {
    return (
      <span className="text-[10px] font-bold leading-none text-green-500">
        ▼{rankChange}
      </span>
    );
  }
  if (state === "same") {
    return (
      <span className="text-[10px] font-bold leading-none text-muted-foreground">
        -
      </span>
    );
  }
  return null;
}

export function HomeTrendingKeywordsSection({
  keywords,
  isLoading,
  rangeLabel,
  onKeywordClick,
}: HomeTrendingKeywordsSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-md font-semibold text-foreground">
        {rangeLabel} 트렌딩 키워드
      </h2>
      {isLoading ? (
        <div className="columns-1 gap-x-10 sm:columns-2 md:columns-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex break-inside-avoid items-center gap-2 border-b border-border py-3"
            >
              <Skeleton className="h-3.5 w-4 shrink-0" />
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-3.5 w-10 shrink-0" />
            </div>
          ))}
        </div>
      ) : keywords.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          집계된 트렌딩 키워드가 없습니다.
        </p>
      ) : (
        <div className="columns-1 gap-x-10 sm:columns-2 md:columns-3">
          {keywords.map((item) => (
            <button
              key={item.keyword}
              onClick={() => onKeywordClick(item.keyword)}
              className={[
                "flex w-full break-inside-avoid cursor-pointer items-center gap-2 border-b border-border py-3 text-sm transition-colors",
                item.isMyInterest ? "text-primary" : "text-foreground",
              ].join(" ")}
            >
              <span className="w-5 shrink-0 text-center text-xs font-bold opacity-50">
                {item.rank}
              </span>
              <span className="flex-1 text-left font-medium">
                {item.keyword}
              </span>
              <div className="flex w-24 shrink-0 items-center justify-end gap-1.5">
                {item.count !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    ({item.count})
                  </span>
                )}
                <DeltaBadge
                  state={item.state}
                  rankChange={item.rankChange}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
