"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CommunityAuthor {
  name: string;
  avatarUrl?: string;
}

export interface BestAnswer {
  author: string;
  content: string;
}

export interface CommunityPost {
  id: string | number;
  title: string;
  body: string;
  tags: string[];
  /** 유저 레벨: "입문" | "주니어" | "미들" | "시니어" */
  level: string;
  timeAgo: string;
  likes: number;
  comments: number;
  author: CommunityAuthor;
  isLiked?: boolean;
  isBookmarked?: boolean;
  bestAnswer?: BestAnswer;
}

interface CommunityCardProps {
  post: CommunityPost;
  onLike?: (id: CommunityPost["id"], liked: boolean) => void;
  onBookmark?: (id: CommunityPost["id"], bookmarked: boolean) => void;
}

const LEVEL_COLORS: Record<string, string> = {
  입문: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  주니어: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  미들: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  시니어: "border-red-500/30 bg-red-500/10 text-red-400",
};

function getLevelColor(level: string) {
  return LEVEL_COLORS[level] ?? "bg-muted text-muted-foreground";
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
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? "border-primary/20 bg-primary/5 text-primary/80";
}

export function CommunityCard({
  post,
  onLike,
  onBookmark,
}: CommunityCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((prev) => (next ? prev + 1 : prev - 1));
    onLike?.(post.id, next);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    onBookmark?.(post.id, next);
  };

  const authorInitial = post.author.name.charAt(0).toUpperCase();

  return (
    <Link href={`/community/${post.id}`} className="block">
      {/*
       * Card가 제공하는 것: border, bg-card, rounded-xl, text-card-foreground
       * !py-0: Card 기본 py-6 제거 (각 섹션에서 직접 패딩 처리)
       * gap-0: Card 기본 gap-6 제거
       * shadow-none: hover shadow 직접 제어
       * rounded-2xl: rounded-xl 오버라이드
       */}
      <Card className="group !py-0 gap-0 rounded-2xl shadow-none transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Author info */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <Avatar className="h-9 w-9 ring-1 ring-primary/20">
            <AvatarImage
              src={post.author.avatarUrl ?? ""}
              alt={`${post.author.name} avatar`}
            />
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {authorInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {post.author.name}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-semibold",
                getLevelColor(post.level),
              )}
            >
              {post.level}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {post.timeAgo}
            </span>
          </div>
        </div>

        {/* Title & Body & Tags */}
        <CardContent className="!px-5 pb-3 pt-0">
          <h3 className="mb-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
            {post.title}
          </h3>
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.body}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
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
        </CardContent>

        {/* Action buttons */}
        <CardFooter
          className="!px-5 py-3 gap-4"
          onClick={(e) => e.preventDefault()}
        >
          {/* 좋아요 - 아이콘 + 카운트 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "h-auto gap-1.5 px-1.5 py-1 duration-200",
              isLiked
                ? "text-red-500 hover:bg-transparent hover:text-red-400"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          >
            <Heart
              className="h-4 w-4"
              fill={isLiked ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">{likeCount}</span>
          </Button>

          {/* 댓글 - 아이콘 + 카운트 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="h-auto gap-1.5 px-1.5 py-1 text-muted-foreground hover:bg-transparent hover:text-foreground duration-200"
            aria-label="댓글"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{post.comments}</span>
          </Button>

          {/* 북마크 - 아이콘 전용 */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleBookmark}
            className={cn(
              "rounded-md duration-200",
              isBookmarked
                ? "text-primary hover:bg-transparent hover:text-primary/80"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
            aria-label={isBookmarked ? "북마크 해제" : "북마크"}
          >
            <Bookmark
              className="h-4 w-4"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </Button>

          {/* 공유 - 아이콘 전용 */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="rounded-md text-muted-foreground hover:bg-transparent hover:text-foreground duration-200"
            aria-label="공유"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </CardFooter>

        {/* Best Answer Preview */}
        {post.bestAnswer && (
          <div className="border-t border-border/50 px-5 pb-5 pt-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <Badge
                  variant="secondary"
                  className="border border-primary/20 bg-primary/10 px-2 py-0 text-[10px] font-semibold text-primary"
                >
                  베스트 답변
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  {post.bestAnswer.author}
                </span>
              </div>
              <p className="line-clamp-2 text-sm leading-relaxed text-foreground/80">
                {post.bestAnswer.content}
              </p>
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
