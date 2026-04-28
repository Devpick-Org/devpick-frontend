"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { QuizResult } from "@/components/features/home/quiz/QuizResult";
import { fetchMyQuizHistoryDetail } from "@/lib/mock/my-page-wrong-quizzes";
import type { QuizHistoryDetail } from "@/types/myPage";

function QuizResultContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const contentId = params.id;
  const attemptId = searchParams.get("attemptId");

  const [detail, setDetail] = useState<QuizHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(!!attemptId);
  const [isError, setIsError] = useState(!attemptId);

  useEffect(() => {
    if (!attemptId) return;
    fetchMyQuizHistoryDetail(attemptId)
      .then(setDetail)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [attemptId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <>
        <Link
          href={`/home/${contentId}`}
          className="group/back mb-8 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
          본문으로
        </Link>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-md font-semibold text-foreground">
              결과를 불러오지 못했어요
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              퀴즈 기록을 찾을 수 없습니다.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        href={`/home/${contentId}`}
        className="group/back mb-8 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        본문으로
      </Link>
      <QuizResult
        mode="history"
        detail={detail}
        onBack={() => router.push(`/home/${contentId}`)}
        onRetry={() => router.push(`/home/${contentId}/quiz`)}
      />
    </>
  );
}

export default function QuizResultPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <QuizResultContent />
      </Suspense>
    </div>
  );
}
