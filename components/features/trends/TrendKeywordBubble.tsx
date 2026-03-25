import { cn } from "@/lib/utils";
import type { KeywordTier } from "@/types/trends";

interface TrendKeywordBubbleProps {
  keyword: string;
  rank: number;
  tier: KeywordTier;
}

const TIER_STYLES: Record<KeywordTier, string> = {
  large: "px-5 py-2.5 text-base font-bold",
  medium: "px-4 py-2 text-sm font-semibold",
  small: "px-3 py-1.5 text-xs font-medium",
};

const TIER_COLOR_STYLES: Record<KeywordTier, string> = {
  large: "bg-primary/15 text-primary hover:bg-primary/20",
  medium: "bg-secondary text-foreground hover:bg-secondary/80",
  small: "bg-muted text-muted-foreground hover:bg-muted/80",
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
        "inline-flex items-center rounded-full transition-colors cursor-default select-none",
        TIER_STYLES[tier],
        TIER_COLOR_STYLES[tier],
      )}
    >
      {keyword}
    </span>
  );
}
