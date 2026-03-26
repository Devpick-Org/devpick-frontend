import { cn } from "@/lib/utils";
import type { KeywordTier } from "@/types/trends";

interface TrendKeywordBubbleProps {
  keyword: string;
  rank: number;
  tier: KeywordTier;
}

const TIER_STYLES: Record<KeywordTier, string> = {
  top: "px-6 py-3 text-xl font-black",
  large: "px-5 py-2.5 text-base font-bold",
  medium: "px-4 py-2 text-sm font-semibold",
  small: "px-3 py-1.5 text-xs font-medium",
};

const TIER_COLOR_STYLES: Record<KeywordTier, string> = {
  top: "bg-primary/15 text-primary",
  large: "bg-primary/15 text-primary",
  medium: "bg-secondary text-foreground",
  small: "bg-muted/60 text-muted-foreground",
};

export function TrendKeywordBubble({
  keyword,
  rank,
  tier,
}: TrendKeywordBubbleProps) {
  return (
    <span
      title={`#${rank} ${keyword}`}
      className={cn(
        "inline-flex items-center rounded-full transition-all duration-200 cursor-default select-none hover:-translate-y-0.5",
        TIER_STYLES[tier],
        TIER_COLOR_STYLES[tier],
      )}
    >
      {keyword}
    </span>
  );
}
