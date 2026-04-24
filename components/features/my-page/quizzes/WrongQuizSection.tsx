"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WrongQuizCard } from "./WrongQuizCard";
import { fetchMyWrongQuizzesPreview } from "@/lib/mock/my-page-wrong-quizzes";
import type { MyPageQuizHistory } from "@/types/myPage";

export function WrongQuizSection() {
  const [quizzes, setQuizzes] = useState<MyPageQuizHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyWrongQuizzesPreview(4).then((data) => {
      setQuizzes(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">틀린 퀴즈들</h2>
        <Link
          href="/my-page/wrong-quizzes"
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
              className="flex flex-col rounded-xl border border-border bg-card p-3"
            >
              <Skeleton className="mb-1 h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
              <div className="mt-3 flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <p className="text-sm text-muted-foreground">틀린 퀴즈가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quizzes.map((quiz) => (
            <WrongQuizCard key={quiz.attemptId} quiz={quiz} />
          ))}
        </div>
      )}
    </section>
  );
}
