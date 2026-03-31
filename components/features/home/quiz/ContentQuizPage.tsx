"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { quizzesEndpoints } from "@/lib/api/endpoints/quizzes";
import { calculateQuizResult } from "@/lib/quiz/quizResult";
import type {
  QuizStage,
  QuizAnswer,
  QuizLevel,
  QuizSubmitResult,
} from "@/types/quiz";
import { QuizIntro } from "./QuizIntro";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResult } from "./QuizResult";

interface ContentQuizPageProps {
  contentId: string;
}

export function ContentQuizPage({ contentId }: ContentQuizPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ─── 서버 상태 ───────────────────────────────────────────────────────────────
  const [level, setLevel] = useState<QuizLevel>("JUNIOR");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz", contentId, level],
    queryFn: () => quizzesEndpoints.getContentQuiz(contentId, level),
    placeholderData: (prev) => prev,
  });

  const quiz = data?.data ?? null;

  // ─── 로컬 상태 ───────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<QuizStage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<QuizSubmitResult | null>(null);
  const [submitError, setSubmitError] = useState(false);

  // ─── 핸들러 ──────────────────────────────────────────────────────────────────
  function handleLevelChange(newLevel: QuizLevel) {
    setLevel(newLevel);
  }

  function handleStart() {
    setStage("quiz");
    setCurrentIndex(0);
    setAnswers([]);
    setSubmitResult(null);
  }

  function handleSelect(optionId: string) {
    if (!quiz) return;
    const questionId = quiz.questions[currentIndex].id;
    setAnswers((prev) => {
      const others = prev.filter((a) => a.questionId !== questionId);
      return [...others, { questionId, selectedOptionId: optionId }];
    });
  }

  function handlePrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    if (!quiz) return;
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  async function handleSubmit() {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);

    const { correctCount, passed } = calculateQuizResult(
      quiz.questions,
      answers,
      quiz.passingCount,
    );

    try {
      const res = await quizzesEndpoints.submitQuiz(contentId, {
        level,
        score: correctCount,
        totalQuestions: quiz.questions.length,
        passed,
      });
      setSubmitResult(res.data);
      // 인트로로 돌아올 때 hasAttempted 반영되도록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["quiz", contentId, level] });
      setStage("result");
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetry() {
    setStage("intro");
    setCurrentIndex(0);
    setAnswers([]);
    setSubmitResult(null);
    setSubmitError(false);
  }

  function handleBack() {
    router.push(`/home/${contentId}`);
  }

  // ─── 렌더링 ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-md font-semibold text-foreground">
            퀴즈를 불러오지 못했어요
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            이 콘텐츠에 대한 퀴즈가 아직 준비되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);
  const isLast = currentIndex === quiz.questions.length - 1;
  const allAnswered = quiz.questions.every((q) =>
    answers.some((a) => a.questionId === q.id),
  );

  return (
    <div className="space-y-8">
      {stage === "intro" && (
        <QuizIntro
          quiz={quiz}
          selectedLevel={level}
          onLevelChange={handleLevelChange}
          onStart={handleStart}
        />
      )}

      {stage === "quiz" && currentQuestion && (
        <>
          <QuizProgress
            current={currentIndex + 1}
            total={quiz.questions.length}
          />

          <QuizQuestionCard
            question={currentQuestion}
            selectedOptionId={currentAnswer?.selectedOptionId ?? null}
            onSelect={handleSelect}
          />

          {/* 제출 에러 */}
          {submitError && (
            <p className="text-center text-sm font-medium text-red-500">
              제출에 실패했어요. 다시 시도해 주세요.
            </p>
          )}

          {/* 이전 / 다음·제출 버튼 */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="-ml-2 h-4 w-4" />
              이전
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "제출하기"
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
                <ChevronRight className="-mr-2 h-4 w-4" />
              </button>
            )}
          </div>
        </>
      )}

      {stage === "result" && (
        <QuizResult
          quiz={quiz}
          answers={answers}
          submitResult={submitResult}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
