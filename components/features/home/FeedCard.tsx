"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Heart, Share2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { useContentStore } from "@/store/content.store";
import type { Content } from "@/types/content";


// ─── FeedCard ─────────────────────────────────────────────────────────────────

interface FeedCardProps {
  content: Content;
}


export function FeedCard({ content }: FeedCardProps) {
  const { init, toggleLike, toggleScrap, interactions } = useContentStore();
  const [isShareTooltip, setIsShareTooltip] = useState(false);

  useEffect(() => {
    init(content.id, content.isLiked, content.isScrapped);
  }, [content.id, content.isLiked, content.isScrapped, init]);

  const interaction = interactions[content.id];
  const isLiked = interaction?.isLiked ?? content.isLiked;
  const isScrapped = interaction?.isScrapped ?? content.isScrapped;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(content.id);
  };

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleScrap(content.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareTooltip(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/home/${content.id}`,
      );
    }
    setTimeout(() => setIsShareTooltip(false), 1500);
  };

  return (
    <Link href={`/home/${content.id}`} className="block">
      <article className="group border-b border-border/70 py-7 transition-colors">
        <div className="flex items-start gap-5">
          <div className="min-w-0 flex-1">
            {/* Source & time */}
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-medium">{content.sourceName}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="shrink-0">{formatDate(content.publishedAt)}</span>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-foreground transition-opacity group-hover:opacity-80 sm:text">
              {content.title}
            </h3>

            {/* Preview */}
            <p className="mb-3 line-clamp-2 text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {content.preview}
            </p>

            {/* Tags */}
            {content.tags.length > 0 && (
              <p className="mb-4 line-clamp-1 text-sm text-muted-foreground/85">
                {content.tags.slice(0, 3).join(" · ")}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLike}
                className={cn(
                  "rounded-md p-1 transition-colors",
                  isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  className="h-4 w-4"
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>

              <button
                onClick={handleScrap}
                className={cn(
                  "rounded-md p-1 transition-colors",
                  isScrapped
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={isScrapped ? "currentColor" : "none"}
                />
              </button>

              <button
                onClick={handleShare}
                className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="공유"
              >
                <Share2 className="h-4 w-4" />
                {isShareTooltip && (
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-sm">
                    링크 복사됨
                  </span>
                )}
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
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
        {/* Title */}
        <Skeleton className="mb-2 h-6 w-4/5 rounded" />
          <Skeleton className="mb-3 h-6 w-3/5 rounded" />
        {/* Preview */}
        <Skeleton className="mb-2 h-4 w-full rounded" />
          <Skeleton className="mb-3 h-4 w-2/3 rounded" />
        {/* Tags */}
        <Skeleton className="mb-4 h-4 w-40 rounded" />
        {/* Actions */}
        <div className="flex gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
    <div className="hidden shrink-0 sm:block">
          <Skeleton className="h-28 w-28 rounded-lg md:h-32 md:w-32" />
        </div>
      </div>
    </article>
  );
}
