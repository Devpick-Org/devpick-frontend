"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedBookListItem } from "./RecommendedBookListItem";
import { fetchRecommendBooks } from "@/lib/mock/my-page-recommend-book";
import type { MyPageRecommendBook } from "@/types/myPage";

function ListItemSkeleton() {
  return (
    <div className="-mx-2 flex gap-4 px-2 py-3">
      {/* 썸네일 */}
      <Skeleton className="aspect-[2/3] w-24 shrink-0 rounded-sm" />

      <div className="flex flex-1 flex-col gap-2 py-0.5">
        {/* title */}
        <Skeleton className="h-4 w-4/5 rounded" />

        {/* description */}
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-3/4 rounded" />

        {/* authors */}
        <Skeleton className="h-3 w-2/5 rounded" />

        {/* bottom 영역 */}
        <div className="mt-auto flex flex-col gap-1">
          {/* publisher · year */}
          <Skeleton className="h-3 w-24 rounded" />

          {/* price */}
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function RecommendedBookList() {
  const [books, setBooks] = useState<MyPageRecommendBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchRecommendBooks()
      .then((data) => setBooks(data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        추천 서적이 없습니다.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {books.map((book) => (
        <RecommendedBookListItem key={book.bookId} book={book} />
      ))}
    </div>
  );
}
