"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import { contentFeedQueryKey } from "@/lib/content/feedQueryKeys";
import {
  FeedCard,
  FeedCardSkeleton,
} from "@/components/features/home/FeedCard";
import { FeedSearch } from "@/components/features/home/FeedSearch";
import { HomeSearchOverlay } from "@/components/features/home/search/HomeSearchOverlay";
import { useAuthStore } from "@/store/auth.store";
import { LoginPromptDialog } from "@/components/features/auth/LoginPromptDialog";

const PAGE_SIZE = 6;

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  /** 검색·피드 응답의 스크랩/좋아요는 로그인 시에만 의미 있음 — 로그인 전환 시 목록 재조회 */
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const nickname = user?.nickname ?? "개발자";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const handleOpenSearch = useCallback(() => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    setIsSearchOpen(true);
  }, [isAuthenticated]);
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
    queryKey: contentFeedQueryKey({
      searchQuery,
      isAuthenticated,
      job: user?.job,
      tags: user?.tags,
    }),
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
    const seen = new Set<string>();
    return (data?.pages.flatMap((page) => page.data.contents) ?? []).filter(
      (content) => {
        if (seen.has(content.id)) return false;
        seen.add(content.id);
        return true;
      },
    );
  }, [data]);

  const planLimited = data?.pages.some((p) => p.data.planLimited) ?? false;

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

          {!hasNextPage &&
            contents.length > 0 &&
            (planLimited ? (
              <div className="mt-4 rounded-xl bg-card px-5 py-4 text-center">
                <p className="text-sm font-medium text-foreground">
                  무료 플랜은 최신 50개까지만 볼 수 있어요.
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Pro로 업그레이드하면 무제한으로 확인할 수 있습니다.
                </p>
                <Link
                  href="/plans"
                  className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  업그레이드
                </Link>
              </div>
            ) : (
              <p className="py-6 text-center text-sm font-medium text-muted-foreground">
                마지막 콘텐츠입니다.
              </p>
            ))}

          <div ref={loadMoreRef} className="h-4" />
        </div>
      </div>

      <HomeSearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} />
      <LoginPromptDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        message="검색 기능을 사용하려면"
      />
    </div>
  );
}
