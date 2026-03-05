"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

function HeartIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function BookmarkIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function CheckBadgeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
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
      <article className="group rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
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
            <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
          </div>
        </div>

        {/* Title & Body */}
        <div className="px-5 pb-3">
          <h3 className="mb-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
            {post.title}
          </h3>
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.body}
          </p>

          {/* Tags */}
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
        </div>

        {/* Action buttons */}
        <div
          className="flex items-center gap-4 px-5 py-3"
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors duration-200",
              isLiked
                ? "text-red-500"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          >
            <HeartIcon className="h-4 w-4" filled={isLiked} />
            <span className="text-xs font-medium">{likeCount}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            aria-label="댓글"
          >
            <MessageIcon className="h-4 w-4" />
            <span className="text-xs font-medium">{post.comments}</span>
          </button>
          <button
            onClick={handleBookmark}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors duration-200",
              isBookmarked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={isBookmarked ? "북마크 해제" : "북마크"}
          >
            <BookmarkIcon className="h-4 w-4" filled={isBookmarked} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            aria-label="공유"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Best Answer Preview */}
        {post.bestAnswer && (
          <div className="border-t border-border/50 px-5 pb-5 pt-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckBadgeIcon className="h-4 w-4 text-primary" />
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
      </article>
    </Link>
  );
}
