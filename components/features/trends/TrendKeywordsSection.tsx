import { TrendKeywordBubbles } from "./TrendKeywordBubbles";
import { TrendKeywordList } from "./TrendKeywordList";
import { formatDate } from "@/lib/utils";
import type { RankedKeyword } from "@/types/trends";

interface TrendKeywordsSectionProps {
  keywords: RankedKeyword[];
  updatedAt: string;
}

export function TrendKeywordsSection({
  keywords,
  updatedAt,
}: TrendKeywordsSectionProps) {
  return (
    <div className="space-y-8">
      {/* 버블 영역 */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-md font-semibold text-foreground">인기 키워드</p>
          <p className="text-xs text-muted-foreground font-medium">
            {formatDate(updatedAt)} 기준
          </p>
        </div>
        <TrendKeywordBubbles keywords={keywords} />
      </div>

      {/* 랭킹 리스트 영역 */}
      <div className="space-y-3">
        <p className="text-md font-semibold text-foreground">순위별 보기</p>
        <TrendKeywordList keywords={keywords} />
      </div>
    </div>
  );
}
