"use client";

import { useEffect, useState } from "react";
import { WrongQuizList } from "./WrongQuizList";
import { WrongQuizListItemSkeleton } from "./WrongQuizListItemSkeleton";
import { fetchMyWrongQuizzes } from "@/lib/mock/my-page-wrong-quizzes";
import type { MyPageQuizHistory } from "@/types/myPage";

export function WrongQuizListWrapper() {
  const [quizzes, setQuizzes] = useState<MyPageQuizHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchMyWrongQuizzes()
      .then((data) => {
        setQuizzes(data);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        {Array.from({ length: 5 }).map((_, i) => (
          <WrongQuizListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <WrongQuizList quizzes={quizzes} />;
}
