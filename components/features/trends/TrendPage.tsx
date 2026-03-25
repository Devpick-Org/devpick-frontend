"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { trendsEndpoints, TREND_QUERY_KEYS } from "@/lib/api/endpoints/trends";
import { TrendKeywordsSection } from "./TrendKeywordsSection";
import { TrendKeywordsSkeleton } from "./TrendKeywordsSkeleton";
import { TrendKeywordsEmpty } from "./TrendKeywordsEmpty";
import type { RankedKeyword, KeywordTier } from "@/types/trends";

function getTier(rank: number): KeywordTier {
  if (rank === 1) return "top";
  if (rank <= 3) return "large";
  if (rank <= 8) return "medium";
  return "small";
}

function toRankedKeywords(keywords: string[]): RankedKeyword[] {
  return keywords.map((keyword, index) => ({
    keyword,
    rank: index + 1,
    tier: getTier(index + 1),
  }));
}

export function TrendPage() {
  const { data: res, isLoading, isError } = useQuery({
    queryKey: TREND_QUERY_KEYS.keywords,
    queryFn: () => trendsEndpoints.getTrendKeywords(),
  });

  if (isLoading) return <TrendKeywordsSkeleton />;

  if (isError || !res?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-foreground">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm font-medium">트렌드 데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const { keywords, updatedAt } = res.data;

  if (keywords.length === 0) return <TrendKeywordsEmpty />;

  return (
    <TrendKeywordsSection
      keywords={toRankedKeywords(keywords)}
      updatedAt={updatedAt}
    />
  );
}
