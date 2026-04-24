"use client";

import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedVideoListItem } from "./RecommendedVideoListItem";
import { MyPagePagination } from "../MyPagePagination";
import { fetchRecommendVideos } from "@/lib/mock/my-page-recommend-video";
import type { MyPageRecommendVideo } from "@/types/myPage";

const PAGE_SIZE = 10;

function ListItemSkeleton() {
  return (
    <div className="-mx-2 flex gap-4 px-2 py-3">
      <Skeleton className="aspect-[3/2] w-36 shrink-0 rounded-sm" />
      <div className="flex flex-1 flex-col gap-2 py-0.5">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="mt-auto h-3 w-24 rounded" />
      </div>
    </div>
  );
}

export function RecommendedVideoList() {
  const [videos, setVideos] = useState<MyPageRecommendVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRecommendVideos()
      .then((data) => setVideos(data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const totalPages = Math.ceil(videos.length / PAGE_SIZE);
  const pagedItems = useMemo(
    () => videos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [videos, currentPage],
  );

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        추천 영상이 없습니다.
      </p>
    );
  }

  return (
    <>
      <div className="divide-y divide-border">
        {pagedItems.map((video) => (
          <RecommendedVideoListItem key={video.videoId} video={video} />
        ))}
      </div>
      <MyPagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-8 mb-12"
      />
    </>
  );
}
