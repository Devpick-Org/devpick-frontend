import { TrendKeywordBubble } from "./TrendKeywordBubble";
import type { RankedKeyword } from "@/types/trends";

interface TrendKeywordBubblesProps {
  keywords: RankedKeyword[];
}

export function TrendKeywordBubbles({ keywords }: TrendKeywordBubblesProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {keywords.map(({ keyword, rank, tier }) => (
        <TrendKeywordBubble key={keyword} keyword={keyword} rank={rank} tier={tier} />
      ))}
    </div>
  );
}
