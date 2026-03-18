import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SimilarPost } from "@/types/community";
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

interface SimilarPostsProps {
  posts: SimilarPost[];
}

export function SimilarPosts({ posts }: SimilarPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-md font-semibold text-foreground">
        유사한 질문
      </h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <p className="mb-2 line-clamp-2 text-sm font-medium leading-snug text-foreground">
              {post.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={cn("font-medium", LEVEL_TEXT_COLORS[post.level])}
              >
                {LEVEL_LABEL[post.level]}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <MessageCircle className="h-3 w-3" />
              <span>{post.answerCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
