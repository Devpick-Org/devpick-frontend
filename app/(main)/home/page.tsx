"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import {
  FeedCard,
  FeedCardSkeleton,
} from "@/components/features/home/FeedCard";
import { FeedSearch } from "@/components/features/home/FeedSearch";
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
  const nickname = user?.nickname ?? "김데브";
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["contents"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      contentsEndpoints.getContents({
        page: pageParam,
        size: PAGE_SIZE,
      }),
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
    <div className="w-full px-4 py-8 lg:px-8">
      {/* Greeting */}
      <section className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
            안녕하세요, {nickname}님
          </h1>
          <WaveIcon className="text-3xl md:text-4xl" />
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          오늘의 맞춤 추천 콘텐츠를 확인해 보세요.
        </p>
      </section>

      {/* Search */}
      <div className="mb-6">
        <FeedSearch />
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <FeedCardSkeleton key={i} />)}

        {isError && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            피드를 불러오는 중 문제가 발생했습니다.
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
          <p className="py-6 text-center text-sm text-muted-foreground">
            마지막 콘텐츠입니다.
          </p>
        )}

        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
