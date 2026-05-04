"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendedHomePostCard } from "./RecommendedHomePostCard";
import { RecommendedVideoCard } from "./RecommendedVideoCard";
import { RecommendedBookCard } from "./RecommendedBookCard";
import {
  getRecommendContents,
  getRecommendYoutube,
  getRecommendBooks,
  MY_PAGE_QUERY_KEYS,
} from "@/lib/api/endpoints/myPage";

function SubSectionHeader({ title, href }: { title: string; href: string }) {
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
  const {
    data: homePostsData,
    isLoading: homeLoading,
    isError: homeError,
  } = useQuery({
    queryKey: MY_PAGE_QUERY_KEYS.recommendContents,
    queryFn: getRecommendContents,
  });

  const {
    data: videosData,
    isLoading: videosLoading,
    isError: videosError,
  } = useQuery({
    queryKey: MY_PAGE_QUERY_KEYS.recommendYoutube,
    queryFn: getRecommendYoutube,
  });

  const {
    data: booksData,
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery({
    queryKey: MY_PAGE_QUERY_KEYS.recommendBooks,
    queryFn: getRecommendBooks,
  });

  const homePosts = (homePostsData?.contents ?? []).slice(0, 8);
  const videos = (videosData?.videos ?? []).slice(0, 8);
  const books = (booksData?.books ?? []).slice(0, 8);

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-foreground">
        사용자 맞춤 추천
      </h2>

      <div className="space-y-8">
        <div>
          <SubSectionHeader title="홈 추천 글" href="/my-page/recommend/home" />
          {homeLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : homeError ? (
            <p className="text-sm text-muted-foreground">
              불러오는 중 오류가 발생했습니다.
            </p>
          ) : !homePostsData?.isPersonalized ? (
            <p className="text-sm text-muted-foreground">
              {homePostsData?.message ??
                "아직 추천할 글이 부족해요. 더 많은 글을 읽어보세요!"}
            </p>
          ) : homePosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">추천 글이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {homePosts.map((post) => (
                <RecommendedHomePostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <div>
          <SubSectionHeader
            title="추천 유튜브"
            href="/my-page/recommend/video"
          />
          {videosLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : videosError ? (
            <p className="text-sm text-muted-foreground">
              불러오는 중 오류가 발생했습니다.
            </p>
          ) : !videosData?.isPersonalized ? (
            <p className="text-sm text-muted-foreground">
              {videosData?.message ?? "아직 추천할 영상이 부족해요. 더 많은 글을 읽어보세요!"}
            </p>
          ) : videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              추천 영상이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {videos.map((video) => (
                <RecommendedVideoCard key={video.contentId} video={video} />
              ))}
            </div>
          )}
        </div>

        <div>
          <SubSectionHeader title="추천 서적" href="/my-page/recommend/book" />
          {booksLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : booksError ? (
            <p className="text-sm text-muted-foreground">
              불러오는 중 오류가 발생했습니다.
            </p>
          ) : !booksData?.isPersonalized ? (
            <p className="text-sm text-muted-foreground">
              {booksData?.message ?? "아직 추천할 도서가 부족해요. 더 많은 글을 읽어보세요!"}
            </p>
          ) : books.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              추천 서적이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {books.map((book) => (
                <RecommendedBookCard key={book.url} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
