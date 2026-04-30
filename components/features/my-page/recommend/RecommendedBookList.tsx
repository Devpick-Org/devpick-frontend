"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedBookListItem } from "./RecommendedBookListItem";
import { fetchRecommendBooks } from "@/lib/mock/my-page-recommend-book";
import type { MyPageRecommendBooksResponse } from "@/types/myPage";

function ListItemSkeleton() {
  return (
    <div className="-mx-2 flex gap-4 px-2 py-3">
      <Skeleton className="aspect-[2/3] w-24 shrink-0 rounded-sm" />
      <div className="flex flex-1 flex-col gap-2 py-0.5">
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-3/4 rounded" />
        <Skeleton className="h-3 w-2/5 rounded" />
        <div className="mt-auto flex flex-col gap-1">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function RecommendedBookList() {
  const [booksData, setBooksData] =
    useState<MyPageRecommendBooksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchRecommendBooks()
      .then((data) => setBooksData(data))
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

  if (!booksData?.isPersonalized) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {booksData?.message ?? "아직 추천할 도서가 부족해요. 더 많은 글을 읽어보세요!"}
      </p>
    );
  }

  const books = booksData.books;

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
        <RecommendedBookListItem key={book.url} book={book} />
      ))}
    </div>
  );
}
