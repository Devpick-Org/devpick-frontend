"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Heart, Share2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeedCardItem {
  id: string | number;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  tags: string[];
  imageUrl?: string;
  isScrapped?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}

interface FeedCardProps {
  item: FeedCardItem;
  onLike?: (id: FeedCardItem["id"], liked: boolean) => void;
  onScrap?: (id: FeedCardItem["id"], scrapped: boolean) => void;
}

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

export function FeedCard({ item, onLike, onScrap }: FeedCardProps) {
  const [isScrapped, setIsScrapped] = useState(item.isScrapped ?? false);
  const [isLiked, setIsLiked] = useState(item.isLiked ?? false);
  const [isShareTooltip, setIsShareTooltip] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isLiked;
    setIsLiked(next);
    onLike?.(item.id, next);
  };

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isScrapped;
    setIsScrapped(next);
    onScrap?.(item.id, next);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareTooltip(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/home/${item.id}`,
      );
    }
    setTimeout(() => setIsShareTooltip(false), 1500);
  };

  return (
    <Link href={`/home/${item.id}`} className="block">
      {/*
       * Card가 제공하는 것: border, bg-card, rounded-xl, text-card-foreground
       * !p-0: Card 기본 py-6 제거 (내부 div에서 직접 패딩 처리)
       * gap-0: Card 기본 gap-6 제거
       * shadow-none: Card 기본 shadow-sm 제거 (hover shadow는 직접 제어)
       * rounded-2xl: rounded-xl 오버라이드
       */}
      <Card className="group relative !p-0 gap-0 rounded-2xl shadow-none transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex cursor-pointer items-stretch p-5">
          {/* Left: Text content */}
          <div className="flex flex-1 flex-col">
            {/* Source & time */}
            <div className="mb-2 flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {item.source}
              </span>
              <span className="text-xs text-muted-foreground/50">/</span>
              <span className="text-xs text-muted-foreground/70">
                {item.timeAgo}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-1.5 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {item.title}
            </h3>

            {/* Summary */}
            <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>

            {/* Tags */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
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
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleLike}
                className={cn(
                  "rounded-lg duration-200",
                  isLiked
                    ? "text-red-500 hover:bg-transparent hover:text-red-400"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={isLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  className="h-4 w-4"
                  fill={isLiked ? "currentColor" : "none"}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleScrap}
                className={cn(
                  "rounded-lg duration-200",
                  isScrapped
                    ? "text-primary hover:bg-transparent hover:text-primary/80"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={isScrapped ? "currentColor" : "none"}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleShare}
                className="relative rounded-lg duration-200 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="공유"
              >
                <Share2 className="h-4 w-4" />
                {isShareTooltip && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
                    복사됨!
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Thumbnail */}
          {item.imageUrl && (
            <div className="ml-5 hidden shrink-0 sm:block">
              <div className="relative h-[120px] w-[120px] overflow-hidden rounded-xl bg-secondary">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
