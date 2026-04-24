import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WrongQuizList } from "@/components/features/my-page/quizzes/WrongQuizList";
import { fetchMyWrongQuizzes } from "@/lib/mock/my-page-wrong-quizzes";

export default async function WrongQuizzesPage() {
  const quizzes = await fetchMyWrongQuizzes();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 lg:px-8">
      <Link
        href="/my-page"
        className="group/back inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        마이페이지
      </Link>

      <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
        틀린 퀴즈들
      </h1>

      <WrongQuizList quizzes={quizzes} />
    </div>
  );
}
