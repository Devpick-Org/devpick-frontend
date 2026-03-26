import { Crown } from "lucide-react";
import { TrendKeywordBubble } from "./TrendKeywordBubble";
import type { RankedKeyword } from "@/types/trends";

interface TrendKeywordBubblesProps {
  keywords: RankedKeyword[];
}

export function TrendKeywordBubbles({ keywords }: TrendKeywordBubblesProps) {
  const top = keywords.filter((k) => k.tier === "top" || k.tier === "large"); // 1~3위
  const mid = keywords.filter((k) => k.tier === "medium"); // 4~8위
  const rest = keywords.filter((k) => k.tier === "small"); // 9위~

  const first = top[0];
  const secondThird = top.slice(1);

  return (
    <div className="flex flex-col items-center gap-3 py-2 md:gap-4">
      {/* 1위: 단독 한 줄, crown 아이콘 */}
      {first && (
        <div className="relative inline-flex flex-col items-center gap-0.5 transition-all duration-200 hover:-translate-y-0.5">
          <Crown className="h-7 w-7 text-yellow-500" />
          <div className="pointer-events-none">
            <TrendKeywordBubble
              keyword={first.keyword}
              rank={first.rank}
              tier={first.tier}
            />
          </div>
        </div>
      )}

      {/* 2~3위: 한 줄 중앙 */}
      {secondThird.length > 0 && (
        <div className="flex justify-center gap-3">
          {secondThird.map(({ keyword, rank, tier }) => (
            <TrendKeywordBubble
              key={keyword}
              keyword={keyword}
              rank={rank}
              tier={tier}
            />
          ))}
        </div>
      )}

      {/* 4~8위 */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {mid.map(({ keyword, rank, tier }) => (
          <TrendKeywordBubble
            key={keyword}
            keyword={keyword}
            rank={rank}
            tier={tier}
          />
        ))}
      </div>

      {/* 9위~ */}
      <div className="flex flex-wrap justify-center gap-2">
        {rest.map(({ keyword, rank, tier }) => (
          <TrendKeywordBubble
            key={keyword}
            keyword={keyword}
            rank={rank}
            tier={tier}
          />
        ))}
      </div>
    </div>
  );
}
