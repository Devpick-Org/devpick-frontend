"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  AlertCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { quizzesEndpoints } from "@/lib/api/endpoints/quizzes";
import { extractApiError } from "@/lib/api/extractApiError";
import { calculateQuizResult } from "@/lib/quiz/quizResult";
import { useAuthStore } from "@/store/auth.store";
import type {
  QuizStage,
  QuizAnswer,
  QuizAnswers,
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

function isAnswered(answer: QuizAnswer | undefined): boolean {
  if (!answer) return false;
  if (answer.type === "multiple_choice") return answer.selectedOptionId !== null;
  return answer.answerText.trim() !== "";
}

export function ContentQuizPage({ contentId }: ContentQuizPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ─── 서버 상태 ───────────────────────────────────────────────────────────────
  const QUIZ_LEVELS: QuizLevel[] = ["BEGINNER", "JUNIOR", "MIDDLE", "SENIOR"];
  const userLevel = useAuthStore((s) => s.user?.level);
  const defaultLevel: QuizLevel =
    userLevel && (QUIZ_LEVELS as readonly string[]).includes(userLevel)
      ? (userLevel as QuizLevel)
      : "JUNIOR";

  // contentId가 다르면 사용자 선택이 없는 것으로 간주 → defaultLevel(프로필 수준)로 폴백
  const [userSelected, setUserSelected] = useState<{
    forContentId: string;
    level: QuizLevel;
  } | null>(null);
  const level =
    userSelected?.forContentId === contentId
      ? userSelected.level
      : defaultLevel;

  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ["quiz", contentId, level],
    queryFn: () => quizzesEndpoints.getContentQuiz(contentId, level),
    placeholderData: (prev) => prev,
  });

  const quiz = data?.data ?? null;

  const isPreparingState =
    isError && extractApiError(error).code === "CONTENT_007";
  const [prepCountdown, setPrepCountdown] = useState(30);
  const prepFiredRef = useRef(false);

  // kind 변경(isPreparingState on/off) 시 countdown / guard 리셋
  useEffect(() => {
    if (isPreparingState) {
      setPrepCountdown(30);
      prepFiredRef.current = false;
    }
  }, [isPreparingState]);

  // 카운트다운 + 자동 재시도 (1회 guard)
  useEffect(() => {
    if (!isPreparingState) return;
    if (prepCountdown <= 0) {
      if (!prepFiredRef.current) {
        prepFiredRef.current = true;
        void refetch();
      }
      return;
    }
    prepFiredRef.current = false;
    const timer = setTimeout(() => setPrepCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPreparingState, prepCountdown, refetch]);

  // ─── 로컬 상태 ───────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<QuizStage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<QuizSubmitResult | null>(null);
  const [submitError, setSubmitError] = useState(false);

  // ─── 핸들러 ──────────────────────────────────────────────────────────────────
  function handleLevelChange(newLevel: QuizLevel) {
    setUserSelected({ forContentId: contentId, level: newLevel });
  }

  function handleStart() {
    setStage("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setSubmitResult(null);
  }

  function handleAnswer(answer: QuizAnswer) {
    setAnswers((prev) => ({ ...prev, [answer.questionId]: answer }));
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
    setAnswers({});
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

  if (isPreparingState) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-md font-semibold text-foreground">
            퀴즈를 준비하고 있어요
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            AI가 콘텐츠를 분석 중이에요.
          </p>
          {prepCountdown > 0 && (
            <p className="text-sm text-muted-foreground font-medium">
              {prepCountdown}초 후 자동으로 다시 시도합니다.
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setPrepCountdown(30);
            void refetch();
          }}
          disabled={isFetching}
          className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isFetching ? "확인 중..." : "지금 다시 시도"}
        </button>
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
  const currentAnswer = answers[currentQuestion?.id];
  const isLast = currentIndex === quiz.questions.length - 1;
  const allAnswered = quiz.questions.every((q) => isAnswered(answers[q.id]));

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
            answer={currentAnswer}
            onAnswer={handleAnswer}
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
                disabled={!isAnswered(currentAnswer)}
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
