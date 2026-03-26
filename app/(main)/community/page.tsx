"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PenLine } from "lucide-react";
import { postsEndpoints } from "@/lib/api/endpoints/posts";
import { CommunityCard } from "@/components/features/community/CommunityCard";
import { CommunitySearch } from "@/components/features/community/CommunitySearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CommunityCardSkeleton() {
  return (
    <article className="border-b border-border/70 py-7">
      {/* Meta row: 아이콘 · 닉네임 · 구분점 · 레벨 · 구분점 · 시간 */}
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-8 rounded" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>

      {/* Title — 1줄 */}
      <Skeleton className="mb-2 h-[26px] w-3/4 rounded-sm" />

      {/* contentPreview — 2줄 */}
      <div className="mb-3">
        <Skeleton className="mb-1.5 h-[22px] w-full rounded-sm" />
        <Skeleton className="h-[22px] w-[80%] rounded-sm" />
      </div>

      {/* Action row: 댓글 수 + 공유 */}
      <div className="mt-4 flex items-center gap-3">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-12 rounded" />
      </div>

      {/* topAnswerPreview 박스 */}
      <div className="mt-5 rounded-xl bg-muted/40 px-4 py-3">
        <Skeleton className="mb-2 h-3 w-16 rounded" />
        <Skeleton className="mb-1.5 h-[22px] w-full rounded-sm" />
        <Skeleton className="h-[22px] w-[70%] rounded-sm" />
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", searchQuery],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      if (searchQuery.trim()) {
        return postsEndpoints.searchPosts({
          query: searchQuery,
          page: pageParam,
          size: PAGE_SIZE,
        });
      }
      return postsEndpoints.getPosts({ page: pageParam, size: PAGE_SIZE });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
  });

  const posts = useMemo(
    () => data?.pages.flatMap((p) => p.data.posts) ?? [],
    [data],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <section className="mb-6 flex items-start justify-between gap-3 md:mb-8 md:items-end">
          <div>
            <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
              커뮤니티
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              개발자들과 질문하고 답변을 나눠보세요.
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-1.5">
            <Link href="/community/write">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">질문하기</span>
              <span className="sm:hidden">질문</span>
            </Link>
          </Button>
        </section>

        {/* Search */}
        <div className="mb-8">
          <CommunitySearch onSearch={setSearchQuery} />
        </div>

        {/* Post list */}
        <div className="flex flex-col">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <CommunityCardSkeleton key={i} />
            ))}

          {isError && (
            <p className="py-10 text-center text-sm font-medium text-muted-foreground">
              게시글을 불러오는 중 문제가 발생했습니다.
            </p>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <p className="py-10 text-center text-sm font-medium text-muted-foreground">
              게시글이 없습니다.
            </p>
          )}

          {!isLoading &&
            !isError &&
            posts.map((post) => <CommunityCard key={post.id} post={post} />)}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => (
              <CommunityCardSkeleton key={`next-${i}`} />
            ))}

          {!hasNextPage && posts.length > 0 && (
            <p className="py-6 text-center text-sm font-medium text-muted-foreground">
              마지막 게시글입니다.
            </p>
          )}

          <div ref={loadMoreRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}
