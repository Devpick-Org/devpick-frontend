"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedHomePostListItem } from "./RecommendedHomePostListItem";
import { fetchRecommendHomePosts } from "@/lib/mock/my-page-recommend-home";
import type { MyPageRecommendContentsResponse } from "@/types/myPage";

function ListItemSkeleton() {
  return (
    <div className="-mx-2 flex gap-4 px-2 py-3">
      <Skeleton className="aspect-[3/2] w-36 shrink-0 rounded-sm" />
      <div className="flex flex-1 flex-col gap-2 py-0.5">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="mt-auto h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export function RecommendedHomePostList() {
  const [postsData, setPostsData] =
    useState<MyPageRecommendContentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchRecommendHomePosts()
      .then((data) => setPostsData(data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

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

  if (!postsData?.isPersonalized) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {postsData?.message ?? "아직 추천할 글이 부족해요. 더 많은 글을 읽어보세요!"}
      </p>
    );
  }

  const posts = postsData.contents;

  if (posts.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        추천 글이 없습니다.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <RecommendedHomePostListItem key={post.id} post={post} />
      ))}
    </div>
  );
}
