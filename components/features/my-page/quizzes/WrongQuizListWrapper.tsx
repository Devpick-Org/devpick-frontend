"use client";

import { useEffect, useState } from "react";
import { WrongQuizList } from "./WrongQuizList";
import { WrongQuizListItemSkeleton } from "./WrongQuizListItemSkeleton";
import { fetchMyQuizHistory } from "@/lib/mock/my-page-wrong-quizzes";
import type { MyPageQuizHistoryResponse } from "@/types/myPage";

type SortOrder = "newest" | "oldest";

export function WrongQuizListWrapper() {
  const [data, setData] = useState<MyPageQuizHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [sort, setSort] = useState<SortOrder>("newest");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchMyQuizHistory({ sort, page, size: 10, wrongOnly: true })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sort, page]);

  const handleSortChange = (value: SortOrder) => {
    setSort(value);
    setPage(0);
    setIsLoading(true);
    setIsError(false);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage - 1);
    setIsLoading(true);
    setIsError(false);
  };

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
        {Array.from({ length: 5 }).map((_, i) => (
          <WrongQuizListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <WrongQuizList
      quizzes={data?.content ?? []}
      totalElements={data?.totalElements ?? 0}
      totalPages={data?.totalPages ?? 0}
      sort={sort}
      page={page}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
    />
  );
}
