"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import {
  FeedCard,
  FeedCardSkeleton,
} from "@/components/features/home/FeedCard";
import { FeedSearch } from "@/components/features/home/FeedSearch";
import { HomeSearchOverlay } from "@/components/features/home/search/HomeSearchOverlay";
import { useAuthStore } from "@/store/auth.store";

const PAGE_SIZE = 6;

function WaveIcon({ className }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transformOrigin: "70% 70%",
        animation: "wave 2s ease-in-out infinite",
      }}
    >
      👋
    </span>
  );
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  /** 검색·피드 응답의 스크랩/좋아요는 로그인 시에만 의미 있음 — 로그인 전환 시 목록 재조회 */
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const nickname = user?.nickname ?? "김데브";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleOpenSearch = useCallback(() => setIsSearchOpen(true), []);
  const handleCloseSearch = useCallback(() => setIsSearchOpen(false), []);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedY = sessionStorage.getItem("homeScrollY");
    if (savedY) {
      window.scrollTo(0, Number(savedY));
      sessionStorage.removeItem("homeScrollY");
    }
  }, []);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: searchQuery.trim()
      ? ["contents", "search", searchQuery, isAuthenticated]
      : ["contents", isAuthenticated],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      if (searchQuery.trim()) {
        // 검색어 있으면 검색 피드
        return contentsEndpoints.searchContents({
          query: searchQuery,
          page: pageParam,
          size: PAGE_SIZE,
        });
      }

      return contentsEndpoints.getContents({
        // 검색어 없으면 일반 피드
        page: pageParam,
        size: PAGE_SIZE,
      });
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.page;
      const totalPages = lastPage.data.totalPages;

      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
  });

  const contents = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.contents) ?? [];
  }, [data]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="w-full px-4 pt-10 pb-6 md:px-6 md:pt-12 md:pb-8">
      <div className="mx-auto max-w-3xl">
        {/* Greeting */}
        <section className="mb-6 text-center md:mb-8">
          <div className="mb-2 flex items-center justify-center gap-2">
            <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
              {nickname}님을 위한 오늘의 추천
            </h1>
            <WaveIcon className="text-xl md:text-3xl" />
          </div>
          <p className="text-sm font-medium text-muted-foreground md:text-base">
            관심 기술과 학습 흐름에 맞춘 개발 콘텐츠를 모아봤어요.
          </p>
        </section>

        {/* Search */}
        <div className="mb-6">
          <FeedSearch onSearch={setSearchQuery} onOpen={handleOpenSearch} />
        </div>

        {/* Feed list */}
        <div className="flex flex-col">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <FeedCardSkeleton key={i} />
            ))}

          {isError && (
            <p className="py-10 text-center text-sm font-medium text-muted-foreground">
              피드를 불러오는 중 문제가 발생했습니다.
            </p>
          )}

          {!isLoading && !isError && contents.length === 0 && (
            <p className="py-10 text-center text-sm font-medium text-muted-foreground">
              {searchQuery.trim()
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
                : "콘텐츠가 없습니다."}
            </p>
          )}

          {!isLoading &&
            !isError &&
            contents.map((content) => (
              <FeedCard key={content.id} content={content} />
            ))}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => (
              <FeedCardSkeleton key={`next-${i}`} />
            ))}

          {!hasNextPage && contents.length > 0 && (
            <p className="py-6 text-center text-sm font-medium text-muted-foreground">
              마지막 콘텐츠입니다.
            </p>
          )}

          <div ref={loadMoreRef} className="h-4" />
        </div>
      </div>

      <HomeSearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} />
    </div>
  );
}
