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

function TagBadge({ tag }: { tag: string }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-border bg-secondary/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-none"
    >
      {tag}
    </Badge>
  );
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
      <Card className="group rounded-2xl border border-border/80 bg-card p-0 shadow-none transition-all duration-200 hover:border-border hover:bg-card/95 hover:shadow-sm">
        <div className="flex items-stretch gap-4 p-6 sm:gap-5">
          <div className={cn("min-w-0 flex-1", content.thumbnailUrl && "sm:pr-1")}>
            
            {/* Source & time */}
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-medium">{content.sourceName}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="shrink-0">{formatDate(content.publishedAt)}</span>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.01em] text-foreground transition-colors group-hover:text-foreground">
              {content.title}
            </h3>

            {/* Preview */}
            <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {content.preview}
            </p>


            {/* Tags */}
            {content.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {content.tags.slice(0, 3).map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLike}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
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
                  "rounded-lg p-2 transition-colors",
                  isScrapped
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
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
                className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
            <div className="hidden shrink-0 self-start sm:block">
              <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border/60 bg-secondary">
                <Image
                  src={content.thumbnailUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

// ─── FeedCardSkeleton ─────────────────────────────────────────────────────────

export function FeedCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-border/80 p-0 shadow-none">
      <div className="flex flex-col gap-3 p-6">
        {/* Source & time */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        {/* Title */}
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-5 w-3/5 rounded" />
        {/* Preview */}
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        {/* Actions */}
        <div className="flex gap-1.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}
