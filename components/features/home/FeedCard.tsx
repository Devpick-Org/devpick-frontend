"use client";

import Link from "next/link";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Thumbnail, getThumbnailMode } from "@/components/ui/thumbnail";
import { cn, formatDate, copyShareLink } from "@/lib/utils";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import {
  updateContentInteractionCache,
  invalidateContentInteractionQueries,
} from "@/lib/content/updateContentInteractionCache";
import { useAuthStore } from "@/store/auth.store";
import { LoginPromptDialog } from "@/components/features/auth/LoginPromptDialog";
import type { Content } from "@/types/content";

// ─── helpers ──────────────────────────────────────────────────────────────────

function isStackOverflow(sourceName: string) {
  return sourceName.trim().toLowerCase() === "stack overflow";
}

const SOURCE_BADGE: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  velog: { bg: "#20C997", text: "#fff", label: "V" },
  "naver blog": { bg: "#03C75A", text: "#fff", label: "N" },
  "naver d2": { bg: "#03C75A", text: "#fff", label: "D2" },
  "kakao tech": { bg: "#FEE500", text: "#3A1D1D", label: "K" },
  우아한형제들: { bg: "#3399FF", text: "#fff", label: "W" },
  medium: { bg: "#000000", text: "#fff", label: "M" },
  "toss tech": { bg: "#0064FF", text: "#fff", label: "T" },
  "oliveyoung tech": { bg: "#3A7D44", text: "#fff", label: "O" },
};

function SourceBadge({ sourceName }: { sourceName: string }) {
  const key = sourceName.trim().toLowerCase();
  const style = SOURCE_BADGE[key];

  if (isStackOverflow(sourceName)) {
    return (
      <span
        className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded text-[8px] font-bold leading-none"
        style={{ background: "#F48024", color: "#fff" }}
      >
        SO
      </span>
    );
  }

  if (style) {
    return (
      <span
        className="flex h-[17px] shrink-0 items-center justify-center rounded px-1 text-[8px] font-bold leading-none"
        style={{ background: style.bg, color: style.text, minWidth: "17px" }}
      >
        {style.label}
      </span>
    );
  }

  // 기본: 이니셜 회색 원형
  return (
    <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
      {sourceName.charAt(0).toUpperCase()}
    </span>
  );
}

// ─── FeedCard ─────────────────────────────────────────────────────────────────

interface FeedCardProps {
  content: Content;
}

export function FeedCard({ content }: FeedCardProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogMessage, setLoginDialogMessage] = useState("");
  const isQA = isStackOverflow(content.sourceName);
  const thumbnailMode = getThumbnailMode(content.thumbnailWidth, content.thumbnailHeight);
  const thumbnailAspectRatio =
    content.thumbnailWidth != null && content.thumbnailHeight != null
      ? content.thumbnailWidth / content.thumbnailHeight
      : undefined;

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
        className="group block cursor-pointer"
        onClick={handleCardClick}
      >
        <article>
          {/* ── Header + Title + Preview ──────────────────────────────────── */}
          <div className="px-1 pt-5 pb-3">
            {/* Header: source badge + name + date + optional Q&A pill */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <SourceBadge sourceName={content.sourceName} />
                <span className="font-semibold">{content.sourceName}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{formatDate(content.publishedAt)}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.01em] text-foreground">
              {content.title}
            </h3>

            {/* Preview */}
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {content.preview}
            </p>
          </div>

          {/* ── Tags ─────────────────────────────────────────────────────── */}
          {content.tags.length > 0 && (
            <div className="px-1 pt-1.5 flex flex-wrap gap-1.5">
              {content.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Thumbnail — blog only, full-width ────────────────────────── */}
          {!isQA && content.thumbnailUrl && (
            <div className="overflow-hidden rounded-lg mt-3 mb-1">
              <Thumbnail
                src={content.thumbnailUrl}
                alt={content.title}
                mode={thumbnailMode}
                aspectRatio={thumbnailAspectRatio}
              />
            </div>
          )}

          {/* ── ActionBar ────────────────────────────────────────────────── */}
          <div className="px-1 pt-3 pb-4">
            {/* ActionBar */}
            <div className="-ml-3 flex items-center gap-0.5">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                  content.isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground",
                  likeMutation.isPending && "pointer-events-none opacity-50",
                )}
                aria-label={content.isLiked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  className="h-4 w-4"
                  fill={content.isLiked ? "currentColor" : "none"}
                />
                <span>좋아요</span>
              </button>

              <button
                onClick={handleScrap}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                  content.isScrapped
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  scrapMutation.isPending && "pointer-events-none opacity-50",
                )}
                aria-label={content.isScrapped ? "스크랩 해제" : "스크랩"}
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={content.isScrapped ? "currentColor" : "none"}
                />
                <span>저장</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                aria-label="공유"
              >
                <Share2 className="h-4 w-4" />
                <span>공유</span>
              </button>
            </div>
          </div>
          <div className="-mx-1 border-b border-border/60" />
        </article>
      </Link>
    </>
  );
}

// ─── FeedCardSkeleton ─────────────────────────────────────────────────────────

export function FeedCardSkeleton() {
  return (
    <article className="-mx-1 border-b border-border/60">
      <div className="px-1 pt-5 pb-3">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-[17px] w-[17px] shrink-0 rounded-full" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>

        {/* Title */}
        <div className="mb-2">
          <Skeleton className="mb-1.5 h-5 w-4/5 rounded-sm" />
          <Skeleton className="h-5 w-2/3 rounded-sm" />
        </div>

        {/* Preview */}
        <div>
          <Skeleton className="mb-1.5 h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-[80%] rounded-sm" />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="mt-3 mb-1 overflow-hidden rounded-lg">
        <Skeleton className="aspect-[5/4] w-full rounded-none" />
      </div>

      <div className="px-1 pt-3 pb-4">
        {/* Tags */}
        <div className="mb-3 flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Skeleton className="h-[30px] w-[68px] rounded-lg" />
          <Skeleton className="h-[30px] w-[60px] rounded-lg" />
          <Skeleton className="h-[30px] w-[52px] rounded-lg" />
        </div>
      </div>
    </article>
  );
}
