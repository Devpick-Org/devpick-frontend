import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RecommendedHomePostList } from "@/components/features/my-page/recommend/RecommendedHomePostList";

export default function RecommendHomePage() {
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
        홈 추천 글
      </h1>

      <RecommendedHomePostList />
    </div>
  );
}
