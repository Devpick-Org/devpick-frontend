import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MyPageQuizHistory } from "@/types/myPage";
import type { QuizLevel } from "@/types/quiz";

const LEVEL_LABEL: Record<QuizLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "초급",
  MIDDLE: "중급",
  SENIOR: "고급",
};

export function WrongQuizListItem({ quiz }: { quiz: MyPageQuizHistory }) {
  const { contentId, contentTitle, thumbnail, preview, level, score, totalQuestions, attemptedAt } =
    quiz;

  return (
    <Link
      href={`/home/${contentId}/quiz/result`}
      className="-mx-2 flex gap-4 px-2 py-3 transition-colors"
    >
      <div className="relative aspect-[3/2] w-36 shrink-0 overflow-hidden rounded-sm bg-muted">
        {thumbnail ? (
          <Image fill src={thumbnail} alt={contentTitle} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {contentTitle}
        </p>

        {preview && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{preview}</p>
        )}

        <span className="mt-auto text-xs text-muted-foreground">
          {LEVEL_LABEL[level]}
          <span className="mx-1">·</span>
          <span className="font-medium text-red-500">
            {totalQuestions - score}개 틀림
          </span>
          <span className="mx-1">·</span>
          {formatDate(attemptedAt)}
        </span>
      </div>
    </Link>
  );
}
