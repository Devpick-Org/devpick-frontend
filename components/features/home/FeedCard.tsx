"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Heart, Share2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Content } from "@/types/content";

// ─── 유틸 ────────────────────────────────────────────────────────────────────

const SOURCE_MAP: Record<string, string> = {
  "velog.io": "Velog",
  "blog.naver.com": "Naver Blog",
  "techblog.naver.com": "Naver D2",
  "techblog.kakao.com": "Kakao Tech",
  "techblog.woowahan.com": "우아한형제들",
};

function getSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return SOURCE_MAP[hostname] ?? hostname;
  } catch {
    return url;
  }
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}일 전`;
  return `${Math.floor(day / 30)}달 전`;
}

// ─── 태그 색상 ────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  React: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  "Next.js": "border-foreground/20 bg-foreground/5 text-foreground/80",
  TypeScript: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  Spring: "border-green-500/30 bg-green-500/10 text-green-400",
  Docker: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  Kubernetes: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  Python: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  AWS: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  "Node.js": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Go: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  Rust: "border-orange-600/30 bg-orange-600/10 text-orange-500",
  DevOps: "border-teal-500/30 bg-teal-500/10 text-teal-400",
  GraphQL: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  "Tailwind CSS": "border-teal-400/30 bg-teal-400/10 text-teal-300",
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? "border-primary/20 bg-primary/5 text-primary/80";
}

// ─── FeedCard ─────────────────────────────────────────────────────────────────

interface FeedCardProps {
  content: Content;
}

export function FeedCard({ content }: FeedCardProps) {
  const [isScrapped, setIsScrapped] = useState(content.isScrapped);
  const [isLiked, setIsLiked] = useState(content.isLiked);
  const [isShareTooltip, setIsShareTooltip] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsScrapped((prev) => !prev);
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
      <Card className="group relative !p-0 gap-0 rounded-2xl shadow-none transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex cursor-pointer items-stretch p-5">
          <div className="flex flex-1 flex-col">
            {/* Source & time */}
            <div className="mb-2 flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {getSourceName(content.canonicalUrl)}
              </span>
              <span className="text-xs text-muted-foreground/50">/</span>
              <span className="text-xs text-muted-foreground/70">
                {formatRelativeTime(content.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-1.5 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {content.title}
            </h3>

            {/* Preview */}
            <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {content.preview}
            </p>

            {/* Tags */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {content.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-medium",
                    getTagColor(tag),
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-auto flex items-center gap-1">
              <button
                onClick={handleLike}
                className={cn(
                  "relative rounded-lg p-1.5 transition-all duration-200",
                  isLiked
                    ? "text-red-500 hover:text-red-400"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleScrap}
                className={cn(
                  "relative rounded-lg p-1.5 transition-all duration-200",
                  isScrapped
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
              >
                <Bookmark className="h-4 w-4" fill={isScrapped ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="relative rounded-lg p-1.5 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
                aria-label="공유"
              >
                <Share2 className="h-4 w-4" />
                {isShareTooltip && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
                    복사됨!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ─── FeedCardSkeleton ─────────────────────────────────────────────────────────

export function FeedCardSkeleton() {
  return (
    <Card className="!p-0 gap-0 rounded-2xl shadow-none">
      <div className="flex flex-col p-5 gap-3">
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
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        {/* Actions */}
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}
