"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { BookmarkedJobCard } from "./BookmarkedJobCard";
import { getMyJobBookmarks } from "@/lib/api/endpoints/myPage";

export function BookmarkedJobsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myJobBookmarksPreview"],
    queryFn: () => getMyJobBookmarks({ page: 0, size: 4, sort: "newest" }),
  });

  const bookmarks = data?.bookmarks ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          스크랩한 공고들
        </h2>
        <Link
          href="/my-page/bookmarks"
          className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between overflow-hidden rounded-md border border-border bg-card p-3"
            >
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              </div>
              <div className="mt-2.5 flex flex-col gap-1.5">
                <Skeleton className="h-3 w-24 rounded" />
                <div className="flex gap-1">
                  <Skeleton className="h-4 w-10 rounded-full" />
                  <Skeleton className="h-4 w-10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">불러오는 중 오류가 발생했습니다.</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-sm text-muted-foreground">스크랩한 공고가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {bookmarks.map((bookmark) => (
            <BookmarkedJobCard key={bookmark.jobPostingId} bookmark={bookmark} />
          ))}
        </div>
      )}
    </section>
  );
}
