import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "./CommunityCard";
import { ContentRenderer } from "./ContentRenderer";
import type { PostDetailDTO } from "@/types/community";
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

interface PostDetailProps {
  post: PostDetailDTO;
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="mb-8">
      <Link
        href="/community"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground font-medium transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        커뮤니티로
      </Link>

      <div className="mb-4 mt-5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <User className="h-3.5 w-3.5 shrink-0" />
        <span>{post.authorNickname}</span>
        <span className="text-muted-foreground/40">·</span>
        <span className={cn("font-medium", LEVEL_TEXT_COLORS[post.level])}>
          {LEVEL_LABEL[post.level]}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>{formatRelativeDate(post.createdAt)}</span>
      </div>

      <h1 className="mb-6 text-2xl font-bold leading-snug tracking-[-0.01em] text-foreground">
        {post.title}
      </h1>

      <ContentRenderer
        content={post.content}
        className="text-[15px] leading-7 text-foreground/90 font-medium"
      />

      <hr className="mt-8 border-border/60" />
    </article>
  );
}
