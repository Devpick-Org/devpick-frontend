"use client";

import { ScrappedPostsSection } from "./scraps/ScrappedPostsSection";
import { WrongQuizSection } from "./quizzes/WrongQuizSection";
import { RecommendedSection } from "./recommend/RecommendedSection";

export default function MyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pt-8 pb-12 lg:px-8">
      <div>
        <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
          마이페이지
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          내 학습 현황과 추천 콘텐츠를 한눈에 확인해 보세요.
        </p>
      </div>

      {/* 1. 스크랩한 글들 */}
      <ScrappedPostsSection />

      {/* 2. 틀린 퀴즈들 */}
      <WrongQuizSection />

      {/* 3. 추천 */}
      <RecommendedSection />
    </div>
  );
}
