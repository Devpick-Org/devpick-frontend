import { CheckCircle2, XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentQuiz, QuizAnswer } from "@/types/quiz";

interface QuizResultProps {
  quiz: ContentQuiz;
  answers: QuizAnswer[];
  onRetry: () => void;
  onBack: () => void;
}

export function QuizResult({
  quiz,
  answers,
  onRetry,
  onBack,
}: QuizResultProps) {
  const correctCount = quiz.questions.filter((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    return answer?.selectedOptionId === q.correctOptionId;
  }).length;

  const passed = correctCount >= quiz.passingCount;

  return (
    <div className="space-y-8">
      {/* 결과 요약 */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl",
            passed ? "bg-green-500/10" : "bg-red-500/10",
          )}
        >
          {passed ? (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
        </div>
        <div className="space-y-1">
          <p
            className={cn(
              "text-lg font-bold",
              passed
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {passed ? "통과!" : "아쉽네요"}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {quiz.questions.length}문제 중{" "}
            <span className="font-bold text-foreground">
              {correctCount}문제
            </span>{" "}
            정답
          </p>
          {!passed && (
            <p className="text-xs font-medium text-muted-foreground">
              통과 기준: {quiz.passingCount}문제 이상
            </p>
          )}
        </div>
      </div>

      {/* 문제별 정오답 */}
      <div className="space-y-3">
        {quiz.questions.map((q, idx) => {
          const answer = answers.find((a) => a.questionId === q.id);
          const isCorrect = answer?.selectedOptionId === q.correctOptionId;
          const selectedOption = q.options.find(
            (o) => o.id === answer?.selectedOptionId,
          );
          const correctOption = q.options.find(
            (o) => o.id === q.correctOptionId,
          );

          return (
            <div
              key={q.id}
              className={cn(
                "rounded-xl p-4 space-y-2",
                isCorrect ? "bg-green-500/5" : "bg-red-500/5",
              )}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                )}
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Q{idx + 1}. {q.question}
                </p>
              </div>

              {!isCorrect && (
                <div className="ml-6 space-y-1 text-xs font-medium">
                  <p className="text-red-600 dark:text-red-400">
                    내 답: {selectedOption?.text ?? "미선택"}
                  </p>
                  <p className="text-green-600 dark:text-green-400">
                    정답: {correctOption?.text}
                  </p>
                </div>
              )}

              <p className="ml-6 text-xs text-muted-foreground font-medium leading-relaxed">
                {q.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onBack}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted/40 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          본문으로 돌아가기
        </button>
        <button
          onClick={onRetry}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          다시 풀기
        </button>
      </div>
    </div>
  );
}
