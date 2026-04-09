"use client";

import Link from "next/link";
import { MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { cn, copyShareLink } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { LoginPromptDialog } from "@/components/features/auth/LoginPromptDialog";
import { AuthorButton } from "./AuthorButton";
import { UserProfileModal } from "./UserProfileModal";
import type { PostSummary, PostLevel } from "@/types/post";

// ─── Level helpers ─────────────────────────────────────────────────────────────

const LEVEL_LABEL: Record<PostLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

const LEVEL_TEXT_COLORS: Record<PostLevel, string> = {
  BEGINNER: "text-emerald-400",
  JUNIOR: "text-blue-400",
  MIDDLE: "text-amber-400",
  SENIOR: "text-red-400",
};

export function formatRelativeDate(createdAt: string): string {
  const now = Date.now();
  const target = new Date(createdAt).getTime();
  const diffMs = now - target;

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "방금 전";

  if (diffMs < hour) {
    const m = Math.floor(diffMs / minute);
    return `${m}분 전`;
  }

  if (diffMs < day) {
    const h = Math.floor(diffMs / hour);
    return `${h}시간 전`;
  }

  if (diffMs < 7 * day) {
    const d = Math.floor(diffMs / day);
    return `${d}일 전`;
  }

  // 👉 7일 이상이면 연도 포함 날짜
  return new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── CommunityCard ─────────────────────────────────────────────────────────────

interface CommunityCardProps {
  post: PostSummary;
}

export function CommunityCard({ post }: CommunityCardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<{ userId: string; nickname: string } | null>(null);

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setLoginDialogOpen(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyShareLink(`${window.location.origin}/community/${post.id}`);
  };

  return (
    <>
      <LoginPromptDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        message="게시글 상세를 보려면"
      />
      <UserProfileModal
        userId={profileInfo?.userId ?? null}
        nickname={profileInfo?.nickname}
        onClose={() => setProfileInfo(null)}
      />
      <Link href={`/community/${post.id}`} className="block" onClick={handleCardClick}>
        <article className="group border-b border-border/70 py-7 transition-colors">
        {/* Meta row: author · level · time */}
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <AuthorButton
            userId={post.authorId}
            nickname={post.authorNickname}
            profileImage={post.authorProfileImage}
            onOpenProfile={(userId) => setProfileInfo({ userId, nickname: post.authorNickname })}
          />
          <span className="text-muted-foreground/40">·</span>
          <span className={cn("font-medium", LEVEL_TEXT_COLORS[post.level])}>
            {LEVEL_LABEL[post.level]}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="shrink-0">{formatRelativeDate(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-foreground transition-opacity">
          {post.title}
        </h3>

        {/* Content preview */}
        <p className="mb-3 line-clamp-2 text-sm leading-6 text-muted-foreground font-medium sm:text-[15px]">
          {post.contentPreview}
        </p>

        {/* Action row */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              aria-label="답변 수"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{post.answerCount}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              aria-label="공유"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">공유</span>
            </button>
          </div>
        </div>

        {/* Top answer preview */}
        {post.topAnswerPreview && (
          <div className="mt-5 rounded-xl bg-primary/5 px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-primary">
              베스트 답변
            </p>
            <p className="line-clamp-2 text-sm leading-6 text-foreground/85">
              {post.topAnswerPreview}
            </p>
          </div>
        )}
        </article>
      </Link>
    </>
  );
}
