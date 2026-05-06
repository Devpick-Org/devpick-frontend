"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Search } from "lucide-react";
import { EcoMarqueeRow } from "./EcoMarqueeRow";
import { EcoTrendExpandOverlay } from "./EcoTrendExpandOverlay";
import { Input } from "@/components/ui/input";
import { trendsEndpoints, TREND_QUERY_KEYS } from "@/lib/api/endpoints/trends";
import { EcosystemTrendsSkeleton } from "./EcosystemTrendsSkeleton";
import type { EcosystemTrendItemDto } from "@/types/trends";
import { cn } from "@/lib/utils";

type SectionKey = "bootcamp" | "club" | "event";

type ExpandState = { title: string; items: EcosystemTrendItemDto[] } | null;

type CatFilter = "all" | SectionKey;

const SECTIONS: { key: SectionKey; title: string; description: string }[] = [
  {
    key: "bootcamp",
    title: "떠오르는 부트캠프",
    description: "부트캠퍼에서 모집 중인 교육 과정입니다.",
  },
  {
    key: "club",
    title: "IT 연합 동아리 모집",
    description: "테카 IT 연합 동아리 DB 기준, 개발 직군이 있는 모집만 표시합니다.",
  },
  {
    key: "event",
    title: "개발자 행사 · 공모전",
    description: "데브이벤트에 등록된 행사·모임·공모전입니다.",
  },
];

export function EcosystemTrendsPage() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q.trim());
  const [catFilter, setCatFilter] = useState<CatFilter>("all");
  const [expand, setExpand] = useState<ExpandState>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: TREND_QUERY_KEYS.ecosystem({ q: deferredQ }),
    queryFn: async () =>
      trendsEndpoints.getEcosystemTrends({
        q: deferredQ || undefined,
        limit: 320,
        offset: 0,
      }),
    staleTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });

  const rawItems = data?.data.items ?? [];

  /** 검색어는 API의 q만 반영. 카테고리 pill은 「보여 줄 섹션」만 줄여서 다른 행이 비지 않도록 함. */
  const bySection = useMemo(() => {
    return {
      bootcamp: rawItems.filter((i) => i.category === "bootcamp"),
      club: rawItems.filter((i) => i.category === "club"),
      event: rawItems.filter((i) => i.category === "event"),
    };
  }, [rawItems]);

  const visibleSections = useMemo(() => {
    if (catFilter === "all") return SECTIONS;
    return SECTIONS.filter((s) => s.key === catFilter);
  }, [catFilter]);

  const fetchedAt = data?.data.fetchedAt;
  const fetchedLabel = fetchedAt
    ? new Date(fetchedAt).toLocaleString("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  if (isLoading) return <EcosystemTrendsSkeleton />;

  if (isError || !data?.success) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-foreground">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium">트렌드 데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목, 주최, 태그, 출처 검색…"
            className="h-12 rounded-lg bg-muted/60 pl-11 pr-4 text-center text-sm text-foreground font-medium placeholder:text-muted-foreground focus-visible:!ring-0 focus-visible:!border-border focus-visible:outline-none"
            aria-label="검색"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "전체"],
              ["bootcamp", "부트캠프"],
              ["club", "동아리"],
              ["event", "행사"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCatFilter(key)}
              className={cn(
                "cursor-pointer rounded-full px-3.5 py-1 text-sm font-medium transition-colors",
                catFilter === key
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {fetchedLabel ? (
          <p className="text-xs text-muted-foreground">마지막 수집: {fetchedLabel}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-12">
        {visibleSections.map((s) => (
          <EcoMarqueeRow
            key={s.key}
            title={s.title}
            description={s.description}
            items={bySection[s.key]}
            initialOffset={s.key === "club" ? 148 : 0}
            onExpand={() =>
              setExpand({
                title: s.title,
                items: bySection[s.key],
              })
            }
          />
        ))}
      </div>

      <EcoTrendExpandOverlay
        open={expand != null}
        onClose={() => setExpand(null)}
        title={expand?.title ?? ""}
        items={expand?.items ?? []}
      />
    </>
  );
}
