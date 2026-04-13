"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileDown,
  ImageIcon,
  Paperclip,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "./CommunityCard";
import { ContentRenderer } from "./ContentRenderer";
import { AuthorButton } from "./AuthorButton";
import { UserProfileModal } from "./UserProfileModal";
import type { PostAttachmentDTO, PostDetailDTO } from "@/types/community";
import type { PostLevel } from "@/types/post";

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

const JOB_LABEL: Record<string, string> = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  FULLSTACK: "풀스택",
};

interface PostDetailProps {
  post: PostDetailDTO;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

function AttachmentItem({ attachment }: { attachment: PostAttachmentDTO }) {
  if (attachment.type === "image") {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-36 rounded-lg border border-border bg-muted"
        title={attachment.fileName}
      >
        <div className="relative h-24 w-full overflow-hidden rounded-t-lg">
          <Image
            src={attachment.url}
            alt={attachment.fileName}
            fill
            className="object-contain transition-opacity group-hover:opacity-80"
            sizes="144px"
          />
        </div>
        <div className="flex items-center gap-1 border-t border-border/60 px-2 py-1">
          <ImageIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="max-w-[116px] truncate text-[11px] font-medium text-muted-foreground">
            {attachment.fileName}
          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={attachment.url}
      download={attachment.fileName}
      className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted"
    >
      <FileDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col overflow-hidden">
        <span className="truncate font-medium text-foreground">
          {attachment.fileName}
        </span>
      </div>
    </a>
  );
}

export function PostDetail({ post, isAuthor, onEdit, onDelete, isDeleting }: PostDetailProps) {
  const [profileInfo, setProfileInfo] = useState<{ userId: string; nickname: string } | null>(null);

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/community/${post.id}`,
      );
      toast.success("링크가 복사되었습니다.");
    }
  }, [post.id]);

  return (
    <>
    <UserProfileModal
      userId={profileInfo?.userId ?? null}
      nickname={profileInfo?.nickname}
      onClose={() => setProfileInfo(null)}
    />
    <article className="mb-8">
      <Link
        href="/community"
        className="group/back mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        커뮤니티로
      </Link>

      <div className="mb-4 mt-5 flex items-start justify-between gap-4">
        <h1 className="flex-1 text-2xl font-bold leading-snug tracking-[-0.01em] text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-1 shrink-0">
          {isAuthor && (
            <>
              <button
                onClick={onEdit}
                className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:text-foreground cursor-pointer"
                aria-label="수정"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:text-destructive cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="삭제"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
          <button
            onClick={handleShare}
            className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:text-foreground cursor-pointer"
            aria-label="공유"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <AuthorButton
          userId={post.authorId}
          nickname={post.authorNickname}
          profileImage={post.authorProfileImage}
          onOpenProfile={(userId) => setProfileInfo({ userId, nickname: post.authorNickname })}
        />
        {post.authorJob && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span>{JOB_LABEL[post.authorJob] ?? post.authorJob}</span>
          </>
        )}
        <span className="text-muted-foreground/40">·</span>
        <span className={cn("font-medium", LEVEL_TEXT_COLORS[post.level])}>
          {LEVEL_LABEL[post.level]}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>{formatRelativeDate(post.createdAt)}</span>
      </div>

      <ContentRenderer
        content={post.content}
        className="text-[15px] leading-7 text-foreground/90 font-medium"
      />

      {(post.attachments?.length ?? 0) > 0 && (
        <div className="mt-6 space-y-3 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            첨부 파일{" "}
            {(post.attachments?.length ?? 0) > 1 && `${post.attachments?.length}개`}
          </div>
          <div className="flex flex-wrap gap-3">
            {post.attachments?.map((attachment, index) => (
              <AttachmentItem key={index} attachment={attachment} />
            ))}
          </div>
        </div>
      )}

      <hr className="mt-8 border-border/60" />
    </article>
    </>
  );
}
