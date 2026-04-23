"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          전체 보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

export default function MyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-xl font-bold tracking-[-0.01em] text-foreground md:text-2xl">
          마이페이지
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          내 학습 현황과 추천 콘텐츠를 한눈에 확인해 보세요.
        </p>
      </div>

      {/* 1. 로드맵 */}
      <section>
        <SectionHeader title="로드맵" />
        <Skeleton className="h-44 rounded-xl" />
      </section>

      {/* 2. 스크랩한 글들 */}
      <section>
        <SectionHeader title="스크랩한 글들" />
        <SkeletonCards />
      </section>

      {/* 3. 틀린 퀴즈들 */}
      <section>
        <SectionHeader title="틀린 퀴즈들" />
        <SkeletonCards />
      </section>

      {/* 4. 추천 */}
      <section className="space-y-8">
        <SectionHeader title="추천" />

        <div>
          <SectionHeader title="홈 글" />
          <SkeletonCards />
        </div>

        <div>
          <SectionHeader title="유튜브" />
          <SkeletonCards />
        </div>

        <div>
          <SectionHeader title="서적" />
          <SkeletonCards />
        </div>
      </section>
    </div>
  );
}
