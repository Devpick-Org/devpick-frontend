import { Brain, Clock, Target, ChevronRight, History } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentQuiz, QuizLevel } from "@/types/quiz";

const LEVEL_OPTIONS: { value: QuizLevel; label: string }[] = [
  { value: "BEGINNER", label: "입문" },
  { value: "JUNIOR", label: "초급" },
  { value: "MIDDLE", label: "중급" },
  { value: "SENIOR", label: "고급" },
];

interface QuizIntroProps {
  quiz: ContentQuiz;
  selectedLevel: QuizLevel;
  onLevelChange: (level: QuizLevel) => void;
  onStart: () => void;
}

export function QuizIntro({
  quiz,
  selectedLevel,
  onLevelChange,
  onStart,
}: QuizIntroProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Brain className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">{quiz.title}</h2>
        <p className="text-sm text-muted-foreground font-medium">
          방금 읽은 내용을 얼마나 이해했는지 확인해 보세요.
        </p>
      </div>

      {/* 이전 시도 결과 */}
      {quiz.hasAttempted &&
        quiz.lastScore !== null &&
        quiz.lastTotalQuestions !== null && (
          <div className="w-full max-w-sm rounded-2xl border border-border p-4 text-center">
            <div className="mb-1.5 flex items-center justify-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                이전에 풀었던 퀴즈입니다
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              이전 결과:{" "}
              <span className="font-bold text-foreground">
                {quiz.lastScore} / {quiz.lastTotalQuestions}
              </span>{" "}
              <span
                className={cn(
                  "font-semibold",
                  quiz.lastPassed
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                ({quiz.lastPassed ? "통과" : "미통과"})
              </span>
            </p>
          </div>
        )}

      {/* 난이도 선택 */}
      <div className="w-full max-w-sm space-y-2.5">
        <p className="text-left text-sm font-semibold text-foreground">
          난이도 선택
        </p>
        <div className="grid grid-cols-4 gap-2">
          {LEVEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onLevelChange(opt.value)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer",
                selectedLevel === opt.value
                  ? "bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 퀴즈 정보 */}
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Target className="h-4 w-4" />
            문제 수
          </span>
          <span className="text-sm font-semibold text-foreground">
            {quiz.questions.length}문제
          </span>
        </div>
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <ChevronRight className="h-4 w-4" />
            통과 기준
          </span>
          <span className="text-sm font-semibold text-foreground">
            {quiz.passingCount}문제 이상
          </span>
        </div>
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Clock className="h-4 w-4" />
            예상 소요 시간
          </span>
          <span className="text-sm font-semibold text-foreground">
            약 {quiz.estimatedMinutes}분
          </span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 cursor-pointer"
      >
        {quiz.hasAttempted ? "다시 풀기" : "퀴즈 시작하기"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
