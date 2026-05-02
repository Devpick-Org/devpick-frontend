"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedVideoListItem } from "./RecommendedVideoListItem";
import { getRecommendYoutube, MY_PAGE_QUERY_KEYS } from "@/lib/api/endpoints/myPage";

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
  const { data: videosData, isLoading, isError } = useQuery({
    queryKey: MY_PAGE_QUERY_KEYS.recommendYoutube,
    queryFn: getRecommendYoutube,
  });

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

  if (!videosData?.isPersonalized) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {videosData?.message ?? "아직 추천할 영상이 부족해요. 더 많은 글을 읽어보세요!"}
      </p>
    );
  }

  const videos = videosData.videos;

  if (videos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        추천 영상이 없습니다.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {videos.map((video) => (
        <RecommendedVideoListItem key={video.contentId} video={video} />
      ))}
    </div>
  );
}
