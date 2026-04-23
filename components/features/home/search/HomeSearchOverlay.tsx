"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeTrend, type TrendRange } from "@/lib/mock/home-search-trend";
import { useAuthStore } from "@/store/auth.store";
import { HomeRangeTabs } from "./HomeRangeTabs";
import { HomeTopPostsSection } from "./HomeTopPostsSection";
import { HomeTopPostsSummarySection } from "./HomeTopPostsSummarySection";
import { HomeCollectionSummarySection } from "./HomeCollectionSummarySection";
import { HomeTrendingKeywordsSection } from "./HomeTrendingKeywordsSection";

const normalizeTag = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "").replace(/[.#]/g, "");

interface HomeSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeSearchOverlay({ isOpen, onClose }: HomeSearchOverlayProps) {
  const [range, setRange] = useState<TrendRange>("week");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // 배경 스크롤 잠금 + 검색 input 포커스
  // range 초기화는 별도 effect 불필요 — isOpen=false 시 컴포넌트가 언마운트되어 useState 초기값("week")으로 자동 리셋
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      setInputValue("");
    };
  }, [isOpen]);

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const { data, isLoading } = useQuery({
    queryKey: ["homeSearchTrend", { range }],
    queryFn: () => fetchHomeTrend(range),
    staleTime: 5 * 60 * 1000,
    enabled: isOpen,
  });

  const handleRangeChange = useCallback((next: TrendRange) => {
    setRange(next);
  }, []);

  const handleKeywordClick = useCallback((keyword: string) => {
    setInputValue(keyword);
    inputRef.current?.focus();
  }, []);

  const keywordsWithInterest = useMemo(() => {
    const keywords = data?.trendingKeywords ?? [];
    const userTags = user?.tags;
    if (!isAuthenticated || !userTags?.length) return keywords;
    const userTagsNormalized = new Set(userTags.map(normalizeTag));
    return keywords.map((item) => ({
      ...item,
      isMyInterest: userTagsNormalized.has(normalizeTag(item.keyword)),
    }));
  }, [data?.trendingKeywords, isAuthenticated, user]);

  const RANGE_LABEL: Record<TrendRange, string> = {
    day: "일간",
    week: "주간",
    month: "월간",
  };
  const rangeLabel = RANGE_LABEL[range];

  // isOpen이 false면 렌더하지 않음
  // createPortal은 user interaction 이후에만 호출되므로 document.body 접근 안전
  if (!isOpen) return null;

  /** 수집 동향만 day 탭에서 비노출 — Top 5 동향은 항상 노출 */
  const showCollectionSummary = range !== "day";

  return createPortal(
    <div
      // z-[9999]: TopNavVariant(z-50)를 포함한 모든 레이어 위에 렌더
      className="fixed inset-0 z-[9999] flex flex-col bg-white"
    >
      {/* 닫기 버튼 — 우상단 고정 */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:right-10 md:top-8 cursor-pointer"
        aria-label="닫기"
      >
        <X className="h-5 w-5" />
      </button>

      {/* 검색 헤더 — max-w-5xl 중앙 정렬 */}
      <div className="mx-auto w-full max-w-5xl shrink-0 px-6 pb-0 pt-10 md:px-8 md:pt-14">
        <div className="border-b-2 border-foreground pb-3 pr-10">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="관심 주제나 기술을 검색해 보세요..."
              className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground md:text-lg"
            />
          </div>
        </div>
      </div>

      {/* 기간 탭 — max-w-5xl 중앙 정렬 */}
      <HomeRangeTabs
        range={range}
        onChange={handleRangeChange}
        dateLabel={data?.dateLabel ?? ""}
        className="mx-auto w-full max-w-5xl px-6 md:px-8"
      />

      {/* 스크롤 영역 — 전체 너비로 확장해 여백 포함 스크롤 가능 */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto max-w-5xl px-6 py-2 md:px-8 md:py-6">
          <div className="flex flex-col gap-10">
            <HomeTopPostsSection
              posts={data?.topPosts ?? []}
              isLoading={isLoading}
              rangeLabel={rangeLabel}
            />

            <HomeTopPostsSummarySection
              summary={data?.topPostsSummary ?? ""}
              isLoading={isLoading}
              rangeLabel={rangeLabel}
            />

            {showCollectionSummary && (
              <HomeCollectionSummarySection
                summary={data?.collectionSummary ?? ""}
                isLoading={isLoading}
                rangeLabel={rangeLabel}
              />
            )}

            <HomeTrendingKeywordsSection
              keywords={keywordsWithInterest}
              isLoading={isLoading}
              rangeLabel={rangeLabel}
              onKeywordClick={handleKeywordClick}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
