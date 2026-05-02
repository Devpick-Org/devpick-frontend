"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WrongQuizList } from "./WrongQuizList";
import { WrongQuizListItemSkeleton } from "./WrongQuizListItemSkeleton";
import { getMyQuizHistory } from "@/lib/api/endpoints/myPage";

type SortOrder = "newest" | "oldest";

export function WrongQuizListWrapper() {
  const [sort, setSort] = useState<SortOrder>("newest");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myQuizHistory", sort, page],
    queryFn: () =>
      getMyQuizHistory({
        passed: false,
        sort,
        page,
        size: 10,
      }),
  });

  const handleSortChange = (value: SortOrder) => {
    setSort(value);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage - 1);
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <WrongQuizListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        불러오는 중 오류가 발생했습니다.
      </p>
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
