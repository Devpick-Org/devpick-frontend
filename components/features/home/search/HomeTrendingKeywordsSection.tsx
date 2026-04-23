import { Skeleton } from "@/components/ui/skeleton";
import type { TrendKeywordItem } from "@/lib/mock/home-search-trend";

const SKELETON_WIDTHS = [
  "w-16", "w-24", "w-20", "w-14", "w-28",
  "w-16", "w-20", "w-24", "w-14", "w-18",
];

interface HomeTrendingKeywordsSectionProps {
  keywords: TrendKeywordItem[];
  isLoading: boolean;
  rangeLabel: string;
}

export function HomeTrendingKeywordsSection({
  keywords,
  isLoading,
  rangeLabel,
}: HomeTrendingKeywordsSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-foreground">{rangeLabel} 트렌딩 키워드</h2>
      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {SKELETON_WIDTHS.map((w, i) => (
            <Skeleton key={i} className={`h-8 rounded-full ${w}`} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((item) => (
            <span
              key={item.keyword}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
            >
              <span className="w-4 text-center text-xs font-bold text-primary">
                {item.rank}
              </span>
              {item.keyword}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
