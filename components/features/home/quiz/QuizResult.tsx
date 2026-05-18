import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateQuizResult, isQuestionCorrect } from "@/lib/quiz/quizResult";
import type {
  ContentQuiz,
  QuizAnswers,
  QuizSubmitResult,
} from "@/types/quiz";
import type { QuizHistoryDetail } from "@/types/myPage";

type LiveProps = {
  mode?: "live";
  quiz: ContentQuiz;
  answers: QuizAnswers;
  submitResult: QuizSubmitResult | null;
  onRetry: () => void;
  onBack: () => void;
};

type HistoryProps = {
  mode: "history";
  detail: QuizHistoryDetail;
  onRetry: () => void;
  onBack: () => void;
};

export type QuizResultProps = LiveProps | HistoryProps;

function ResultButtons({
  onBack,
  onRetry,
}: {
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={onBack}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-secondary/80 cursor-pointer"
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
  );
}

export function QuizResult(props: QuizResultProps) {
  // ─── 히스토리 모드 ────────────────────────────────────────────────────────────
  if (props.mode === "history") {
    const { detail, onRetry, onBack } = props;
    const {
      score,
      passed,
      totalQuestions,
      pointsEarned,
      passingCount,
      questions,
      myAnswers,
    } = detail;

    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div>
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
            <p className="mt-2 text-sm text-muted-foreground font-medium">
              {totalQuestions}문제 중{" "}
              <span className="font-bold text-foreground">{score}문제</span>{" "}
              정답
            </p>
            {!passed && (
              <p className="text-xs font-medium text-muted-foreground">
                통과 기준: {passingCount}문제 이상
              </p>
            )}
          </div>
          {pointsEarned > 0 && (
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-yellow-500/10 px-4 py-2.5">
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                퀴즈 통과! +{pointsEarned} 포인트 획득
              </span>
            </div>
          )}
        </div>

        {questions === null ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            문제 정보를 불러올 수 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const myAnswer = myAnswers.find((a) => a.questionId === q.id);
              const correct = myAnswer?.isCorrect ?? false;

              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-xl p-4 space-y-2",
                    correct ? "bg-green-500/5 dark:bg-green-500/10" : "bg-red-500/5 dark:bg-red-500/10",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle2 className="mt-[3px] h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-[3px] h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      Q{idx + 1}. {q.question}
                    </p>
                  </div>

                  {!correct && (
                    <div className="ml-6 space-y-1 text-xs font-medium">
                      {q.type === "multiple_choice" ? (
                        <>
                          <p className="text-red-600 dark:text-red-400">
                            내 답:{" "}
                            {myAnswer?.selectedOptionId
                              ? (q.options.find(
                                  (o) => o.id === myAnswer.selectedOptionId,
                                )?.text ?? "미선택")
                              : "미선택"}
                          </p>
                          <p className="text-green-600 dark:text-green-400">
                            정답:{" "}
                            {q.options.find((o) => o.id === q.correctOptionId)
                              ?.text}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-red-600 dark:text-red-400">
                            내 답:{" "}
                            {myAnswer?.answerText?.trim() || "미입력"}
                          </p>
                          <p className="text-green-600 dark:text-green-400">
                            정답: {q.correctAnswer}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {correct && q.type === "short_answer" && (
                    <div className="ml-6 text-xs font-medium text-muted-foreground">
                      입력한 답: {myAnswer?.answerText?.trim() ?? ""}
                    </div>
                  )}

                  <p className="ml-6 text-xs text-muted-foreground font-medium leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <ResultButtons onBack={onBack} onRetry={onRetry} />
      </div>
    );
  }

  // ─── 라이브 모드 (기존 동작 그대로) ───────────────────────────────────────────
  const { quiz, answers, submitResult, onRetry, onBack } = props;
  const { correctCount, passed } = calculateQuizResult(
    quiz.questions,
    answers,
    quiz.passingCount,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <div>
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
          <p className="mt-2 text-sm text-muted-foreground font-medium">
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
        {submitResult && submitResult.pointsEarned > 0 && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-yellow-500/10 px-4 py-2.5">
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              퀴즈 통과! +{submitResult.pointsEarned} 포인트 획득
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {quiz.questions.map((q, idx) => {
          const answer = answers[q.id];
          const correct = isQuestionCorrect(q, answer);

          return (
            <div
              key={q.id}
              className={cn(
                "rounded-xl p-4 space-y-2",
                correct ? "bg-green-500/5 dark:bg-green-500/10" : "bg-red-500/5 dark:bg-red-500/10",
              )}
            >
              <div className="flex items-start gap-2">
                {correct ? (
                  <CheckCircle2 className="mt-[3px] h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="mt-[3px] h-4 w-4 shrink-0 text-red-500" />
                )}
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Q{idx + 1}. {q.question}
                </p>
              </div>

              {!correct && (
                <div className="ml-6 space-y-1 text-xs font-medium">
                  {q.type === "multiple_choice" ? (
                    <>
                      <p className="text-red-600 dark:text-red-400">
                        내 답:{" "}
                        {answer?.type === "multiple_choice" &&
                        answer.selectedOptionId
                          ? (q.options.find(
                              (o) => o.id === answer.selectedOptionId,
                            )?.text ?? "미선택")
                          : "미선택"}
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        정답:{" "}
                        {q.options.find((o) => o.id === q.correctOptionId)
                          ?.text}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-600 dark:text-red-400">
                        내 답:{" "}
                        {answer?.type === "short_answer" &&
                        answer.answerText.trim()
                          ? answer.answerText.trim()
                          : "미입력"}
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        정답: {q.correctAnswer}
                      </p>
                    </>
                  )}
                </div>
              )}

              {correct && q.type === "short_answer" && (
                <div className="ml-6 text-xs font-medium text-muted-foreground">
                  입력한 답:{" "}
                  {answer?.type === "short_answer"
                    ? answer.answerText.trim()
                    : ""}
                </div>
              )}

              <p className="ml-6 text-xs text-muted-foreground font-medium leading-relaxed">
                {q.explanation}
              </p>
            </div>
          );
        })}
      </div>

      <ResultButtons onBack={onBack} onRetry={onRetry} />
    </div>
  );
}
