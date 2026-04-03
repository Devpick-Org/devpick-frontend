"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import { ContentDetail } from "@/components/features/home/ContentDetail";
import { RecommendedContents } from "@/components/features/home/RecommendedContents";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/home");
    }
  }, [mounted, isAuthenticated, router]);

  const {
    data: contentRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["content", id],
    queryFn: () => contentsEndpoints.getContentById(id),
    enabled: mounted && isAuthenticated,
  });

  const { data: recommendedRes } = useQuery({
    queryKey: ["content-recommendations", id],
    queryFn: () => contentsEndpoints.getContentRecommendations(id),
    enabled: mounted && isAuthenticated && !!contentRes?.data,
  });

  const content = contentRes?.data ?? null;
  const recommended = recommendedRes?.data?.contents ?? [];

  if (!mounted || !isAuthenticated) return null;

  if (isLoading) {
    return <ContentDetailSkeleton />;
  }

  if (isError || !content) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* 본문 */}
        <main className="min-w-0">
          <ContentDetail content={content} />
        </main>

        {/* 추천 — 데스크탑 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <RecommendedContents items={recommended} />
          </div>
        </aside>
      </div>

      {/* 추천 — 모바일 */}
      <div className="mt-8 lg:hidden">
        <RecommendedContents items={recommended} />
      </div>
    </div>
  );
}

function ContentDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 pb-20">
          {/* 뒤로가기 */}
          <Skeleton className="mb-8 h-6 w-16" />

          {/* 헤더 — 제목 + 액션 버튼 */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex shrink-0 items-center gap-1">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* 태그 */}
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* AI 요약 */}
          <Skeleton className="mb-10 h-48 w-full rounded-2xl" />

          {/* 본문 */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[88%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[75%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[82%]" />
          </div>
        </div>

        {/* 추천 콘텐츠 — 데스크탑 */}
        <div className="hidden lg:block">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
