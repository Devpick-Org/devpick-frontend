"use client";

import { useEffect, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usersEndpoints } from "@/lib/api/endpoints/users";
import type { UserJob, UserLevel } from "@/types/userProfile";

const JOB_LABELS: Record<UserJob, string> = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  FULLSTACK: "풀스택",
};

const LEVEL_LABELS: Record<UserLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

interface UserProfileModalProps {
  userId: string | null;
  nickname?: string | null;
  onClose: () => void;
}

export function UserProfileModal({
  userId,
  nickname,
  onClose,
}: UserProfileModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!userId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [userId, onClose]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () =>
      usersEndpoints.getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  if (!userId) return null;

  const profile = data?.data;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-2xl",
          "-translate-x-1/2 -translate-y-1/2",
          "max-h-[80vh] overflow-y-auto",
          "rounded-xl bg-card border border-border shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {isLoading && <ProfileSkeleton />}

          {isError && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              프로필을 불러오지 못했습니다.
            </p>
          )}

          {profile && (
            <>
              {/* 헤더: 아바타 + 닉네임 + job · level */}
              <div className="mb-5 flex items-center gap-4">
                <Avatar className="size-14 shrink-0">
                  {profile.profileImage && (
                    <AvatarImage
                      src={profile.profileImage}
                      alt={profile.nickname}
                    />
                  )}
                  <AvatarFallback className="text-lg">
                    {profile.nickname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p
                    id={titleId}
                    className="truncate text-base font-bold text-foreground"
                  >
                    {profile.nickname}
                  </p>
                  {(profile.job || profile.level) && (
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {[
                        profile.job ? JOB_LABELS[profile.job] : null,
                        profile.level ? LEVEL_LABELS[profile.level] : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              {/* 획득 배지 */}
              <section className="mb-7">
                <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-wider text-foreground">
                  획득 배지
                </h3>
                {profile.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.badges.map((badge) => (
                      <span
                        key={badge.badgeId}
                        className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 획득한 배지가 없습니다.
                  </p>
                )}
              </section>

              {/* 최근 질문 */}
              <section className="mb-7">
                <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-wider text-foreground">
                  최근 질문
                </h3>
                {profile.recentPosts.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          href={`/community/${post.id}`}
                          onClick={onClose}
                          className="group flex items-start gap-1.5 text-sm leading-5 text-foreground/80 transition-colors hover:text-foreground"
                        >
                          <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground" />
                          <span className="line-clamp-1">{post.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 질문 내역이 없습니다.
                  </p>
                )}
              </section>

              {/* 최근 답변 */}
              <section>
                <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-wider text-foreground">
                  최근 답변
                </h3>
                {profile.recentAnswers.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.recentAnswers.map((answer) => (
                      <li key={answer.answerId}>
                        <Link
                          href={`/community/${answer.postId}`}
                          onClick={onClose}
                          className="group flex items-start gap-1.5 text-sm leading-5 text-foreground/80 transition-colors hover:text-foreground"
                        >
                          <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground" />
                          <span className="line-clamp-1">
                            {answer.postTitle}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 답변 내역이 없습니다.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <div className="mb-5 flex items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="mb-3 h-3 w-16" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </>
  );
}
