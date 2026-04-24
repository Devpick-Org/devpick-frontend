"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedHomePostCard } from "./RecommendedHomePostCard";
import { RecommendedVideoCard } from "./RecommendedVideoCard";
import { RecommendedBookCard } from "./RecommendedBookCard";
import { fetchRecommendHomePosts } from "@/lib/mock/my-page-recommend-home";
import { fetchRecommendVideos } from "@/lib/mock/my-page-recommend-video";
import { fetchRecommendBooks } from "@/lib/mock/my-page-recommend-book";
import type {
  MyPageRecommendHomePost,
  MyPageRecommendVideo,
  MyPageRecommendBook,
} from "@/types/myPage";

function SubSectionHeader({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <Link
        href={href}
        className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        전체 보기
      </Link>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="mt-1 h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="mt-1 h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function RecommendedSection() {
  const [homePosts, setHomePosts] = useState<MyPageRecommendHomePost[]>([]);
  const [videos, setVideos] = useState<MyPageRecommendVideo[]>([]);
  const [books, setBooks] = useState<MyPageRecommendBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchRecommendHomePosts(4),
      fetchRecommendVideos(4),
      fetchRecommendBooks(4),
    ]).then(([posts, vids, bks]) => {
      setHomePosts(posts);
      setVideos(vids);
      setBooks(bks);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="space-y-8">
      <h2 className="text-base font-semibold text-foreground">추천</h2>

      <div>
        <SubSectionHeader title="홈 글" href="/my-page/recommend/home" />
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : homePosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">추천 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {homePosts.map((post) => (
              <RecommendedHomePostCard key={post.contentId} post={post} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SubSectionHeader title="유튜브" href="/my-page/recommend/video" />
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">추천 영상이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <RecommendedVideoCard key={video.videoId} video={video} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SubSectionHeader title="서적" href="/my-page/recommend/book" />
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="text-sm text-muted-foreground">추천 서적이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <RecommendedBookCard key={book.bookId} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
