"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import { ContentDetail } from "@/components/features/home/ContentDetail";
import { RecommendedContents } from "@/components/features/home/RecommendedContents";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const {
    data: contentRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["content", id],
    queryFn: () => contentsEndpoints.getContentById(id),
  });

  const { data: recommendedRes } = useQuery({
    queryKey: ["content-recommendations", id],
    queryFn: () => contentsEndpoints.getContentRecommendations(id),
    enabled: !!contentRes?.data,
  });

  const content = contentRes?.data ?? null;
  const recommended = recommendedRes?.data?.contents ?? [];

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
        <div className="min-w-0">
          <Skeleton className="mb-8 h-4 w-24" />
          <Skeleton className="mb-4 h-8 w-4/5" />
          <Skeleton className="mb-2 h-4 w-48" />
          <div className="mt-8 space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[88%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
