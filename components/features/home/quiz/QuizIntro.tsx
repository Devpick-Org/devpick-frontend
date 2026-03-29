import { Brain, Clock, Target, ChevronRight } from "lucide-react";
import type { ContentQuiz } from "@/types/quiz";

interface QuizIntroProps {
  quiz: ContentQuiz;
  onStart: () => void;
}

export function QuizIntro({ quiz, onStart }: QuizIntroProps) {
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
        퀴즈 시작하기
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
