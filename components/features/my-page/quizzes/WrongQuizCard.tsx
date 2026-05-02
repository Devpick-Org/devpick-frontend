import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { MyPageQuizHistory } from "@/types/myPage";
import type { QuizLevel } from "@/types/quiz";

const LEVEL_LABEL: Record<QuizLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "초급",
  MIDDLE: "중급",
  SENIOR: "고급",
};

export function LevelBadge({ level }: { level: QuizLevel }) {
  return (
    <span className="rounded-[5px] bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
      {LEVEL_LABEL[level]}
    </span>
  );
}

export function WrongQuizCard({ quiz }: { quiz: MyPageQuizHistory }) {
  const { attemptId, contentId, contentTitle, level, score, totalQuestions, attemptedAt } =
    quiz;

  return (
    <Link href={`/home/${contentId}/quiz/result?attemptId=${attemptId}`}>
      <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-3">
        <p className="line-clamp-2 flex-1 text-sm font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {contentTitle}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {LEVEL_LABEL[level]}
            <span className="mx-1">·</span>
            <span className="font-medium text-red-500">
              {totalQuestions - score}개 틀림
            </span>
          </span>
          <span className="text-muted-foreground">{formatDate(attemptedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
