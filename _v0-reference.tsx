// feed-card.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FeedItem } from "@/lib/feed-data";
export type { FeedItem } from "@/lib/feed-data";

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

function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M15 3h6v6" />

      <path d="M10 14 21 3" />

      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
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
  return TAG_COLORS[tag] || "border-primary/20 bg-primary/5 text-primary/80";
}

export function FeedCard({ item }: { item: FeedItem }) {
  const [isScrapped, setIsScrapped] = useState(item.isScrapped || false);
  const [isLiked, setIsLiked] = useState(false);
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
      navigator.clipboard.writeText(`https://devpick.dev/content/${item.id}`);
    }

    setTimeout(() => setIsShareTooltip(false), 1500);
  };

  return (
    <Link href={`/home/${item.id}`} className="block">
      <article className="group relative flex cursor-pointer items-stretch rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Left: Text content */}
        <div className="flex flex-1 flex-col">
          {/* Source & time */}
          <div className="mb-2 flex items-center gap-2">
            <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {item.source}
            </span>
            <span className="text-xs text-muted-foreground/50">{"/"}</span>
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
            <button
              onClick={handleLike}
              className={cn(
                "relative rounded-lg p-1.5 transition-all duration-200",

                isLiked
                  ? "text-red-500 hover:text-red-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            >
              <HeartIcon className="h-4 w-4" filled={isLiked} />
            </button>

            <button
              onClick={handleScrap}
              className={cn(
                "relative rounded-lg p-1.5 transition-all duration-200",

                isScrapped
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
            >
              <BookmarkIcon className="h-4 w-4" filled={isScrapped} />
            </button>

            <button
              onClick={handleShare}
              className="relative rounded-lg p-1.5 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary"
              aria-label="공유"
            >
              <ShareIcon className="h-4 w-4" />

              {isShareTooltip && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
                  {"복사됨!"}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Conditional image */}

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
      </article>
    </Link>
  );
}

// feed-search.tsx

("use client");
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />

      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
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
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

const QUICK_FILTERS = [
  { id: "all", label: "전체" },
  { id: "frontend", label: "프론트엔드" },
  { id: "backend", label: "백엔드" },
  { id: "devops", label: "DevOps" },
  { id: "trending", label: "인기" },
] as const;

export function FeedSearch() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="search"
          placeholder="관심 주제나 기술을 검색해 보세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 rounded-xl border-border bg-secondary pl-11 pr-12 text-center text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />

        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="필터"
        >
          <FilterIcon className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Quick filter chips */}

      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200",

              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
