"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrappedPostCard } from "./ScrappedPostCard";
import { fetchMyScrapsPreview } from "@/lib/mock/my-page-scraps";
import type { MyPageScrap } from "@/types/myPage";

export function ScrappedPostsSection() {
  const [scraps, setScraps] = useState<MyPageScrap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyScrapsPreview(4).then((res) => {
      setScraps(res.content);
      setIsLoading(false);
    });
  }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          스크랩한 글들
        </h2>
        <Link
          href="/my-page/scraps"
          className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : scraps.length === 0 ? (
        <p className="text-sm text-muted-foreground">스크랩한 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {scraps.map((scrap) => (
            <ScrappedPostCard key={scrap.contentId} scrap={scrap} />
          ))}
        </div>
      )}
    </section>
  );
}
