"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Heart, Share2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate, copyShareLink } from "@/lib/utils";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import {
  updateContentInteractionCache,
  invalidateContentInteractionQueries,
} from "@/lib/content/updateContentInteractionCache";
import { useAuthStore } from "@/store/auth.store";
import { LoginPromptDialog } from "@/components/features/auth/LoginPromptDialog";
import type { Content } from "@/types/content";

// ─── FeedCard ─────────────────────────────────────────────────────────────────

interface FeedCardProps {
  content: Content;
}

export function FeedCard({ content }: FeedCardProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogMessage, setLoginDialogMessage] = useState("");

  const openLoginDialog = (message: string) => {
    setLoginDialogMessage(message);
    setLoginDialogOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openLoginDialog("콘텐츠 상세를 보려면");
    }
  };

  // mutate(wasLiked) — 클릭 직전 상태를 variable로 넘겨 onMutate/mutationFn이 같은 기준으로 동작
  const likeMutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked
        ? contentsEndpoints.unlikeContent(content.id)
        : contentsEndpoints.likeContent(content.id),
    // 상세 + 목록/검색 + 추천 캐시를 동시에 반영
    onMutate: (wasLiked) =>
      updateContentInteractionCache(
        queryClient,
        content.id,
        "isLiked",
        !wasLiked,
      ),
    onError: () => invalidateContentInteractionQueries(queryClient, content.id),
    onSettled: () =>
      invalidateContentInteractionQueries(queryClient, content.id),
  });

  // mutate(wasScrapped) — 같은 패턴
  const scrapMutation = useMutation({
    mutationFn: (wasScrapped: boolean) =>
      wasScrapped
        ? contentsEndpoints.unscrapContent(content.id)
        : contentsEndpoints.scrapContent(content.id),
    onMutate: (wasScrapped) =>
      updateContentInteractionCache(
        queryClient,
        content.id,
        "isScrapped",
        !wasScrapped,
      ),
    onError: () => invalidateContentInteractionQueries(queryClient, content.id),
    onSettled: () =>
      invalidateContentInteractionQueries(queryClient, content.id),
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginDialog("좋아요를 누르려면");
      return;
    }
    if (likeMutation.isPending) return;
    likeMutation.mutate(content.isLiked);
  };

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginDialog("스크랩하려면");
      return;
    }
    if (scrapMutation.isPending) return;
    scrapMutation.mutate(content.isScrapped);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyShareLink(`${window.location.origin}/home/${content.id}`);
  };

  return (
    <>
      <LoginPromptDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        message={loginDialogMessage}
      />
      <Link
        href={`/home/${content.id}`}
        className="block"
        onClick={handleCardClick}
      >
        <article className="group border-b border-border/70 py-7 transition-colors">
          <div className="flex items-start gap-5">
            <div className="min-w-0 flex-1">
              {/* Source & time */}
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-medium">
                  {content.sourceName}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="shrink-0">
                  {formatDate(content.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-2 line-clamp-2 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-foreground transition-opacity sm:text">
                {content.title}
              </h3>

              {/* Preview */}
              <p className="mb-3 line-clamp-2 text-sm leading-6 text-muted-foreground font-medium sm:text-[15px]">
                {content.preview}
              </p>

              {/* Tags */}
              {content.tags.length > 0 && (
                <p className="mb-4 line-clamp-1 text-sm text-muted-foreground/85 font-medium">
                  {content.tags.slice(0, 3).join(" · ")}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleLike}
                  className={cn(
                    "rounded-md p-1 transition-colors cursor-pointer",
                    content.isLiked
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-foreground",
                    likeMutation.isPending && "opacity-50",
                  )}
                  aria-label={content.isLiked ? "좋아요 취소" : "좋아요"}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={content.isLiked ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={handleScrap}
                  className={cn(
                    "rounded-md p-1 transition-colors cursor-pointer",
                    content.isScrapped
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                    scrapMutation.isPending && "opacity-50",
                  )}
                  aria-label={content.isScrapped ? "스크랩 해제" : "스크랩"}
                >
                  <Bookmark
                    className="h-4 w-4"
                    fill={content.isScrapped ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  aria-label="공유"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 썸네일 — sm 이상에서만 노출, 없으면 렌더링 안 함 */}
            {content.thumbnailUrl && (
              <div className="hidden shrink-0 sm:block">
                <div className="relative h-[190px] w-[200px] overflow-hidden rounded-sm bg-secondary">
                  <Image
                    src={content.thumbnailUrl}
                    alt={content.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            )}
          </div>
        </article>
      </Link>
    </>
  );
}

// ─── FeedCardSkeleton ─────────────────────────────────────────────────────────

export function FeedCardSkeleton() {
  return (
    <article className="border-b border-border/70 py-7">
      <div className="flex items-start gap-5">
        <div className="min-w-0 flex-1">
          {/* Source & time */}
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>

          {/* Title */}
          <div className="mb-2">
            <Skeleton className="mb-1.5 h-6 w-4/5 rounded-sm" />
            <Skeleton className="h-6 w-3/5 rounded-sm" />
          </div>

          {/* Preview */}
          <div className="mb-3">
            <Skeleton className="mb-1.5 h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-[85%] rounded-sm" />
          </div>

          {/* Tags */}
          <Skeleton className="mb-4 h-4 w-40 rounded-sm" />

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-[26px] w-[26px] rounded-md" />
            <Skeleton className="h-[26px] w-[26px] rounded-md" />
            <Skeleton className="h-[30px] w-[30px] rounded-md" />
          </div>
        </div>

        {/* 썸네일 */}
        <div className="hidden shrink-0 sm:block">
          <Skeleton className="h-[190px] w-[200px] rounded-sm" />
        </div>
      </div>
    </article>
  );
}
