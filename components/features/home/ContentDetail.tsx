"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Bookmark, Share2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, formatDate } from "@/lib/utils";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import {
  updateContentInteractionCache,
  invalidateContentInteractionQueries,
} from "@/lib/content/updateContentInteractionCache";
import type { ContentDetail as ContentDetailType, ContentDetailResponse } from "@/types/content";
import { AiSummary } from "./AiSummary";
import { BlogDetailBody } from "./BlogDetailBody";
import { toast } from "sonner";

interface ContentDetailProps {
  content: ContentDetailType;
}

export function ContentDetail({ content }: ContentDetailProps) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked
        ? contentsEndpoints.unlikeContent(content.id)
        : contentsEndpoints.likeContent(content.id),
    onMutate: async (wasLiked) => {
      await queryClient.cancelQueries({ queryKey: ["content", content.id] });
      const previous = queryClient.getQueryData<ContentDetailResponse>([
        "content",
        content.id,
      ]);
      updateContentInteractionCache(queryClient, content.id, "isLiked", !wasLiked);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["content", content.id], context?.previous);
      invalidateContentInteractionQueries(queryClient, content.id);
    },
    onSettled: () => {
      invalidateContentInteractionQueries(queryClient, content.id);
    },
  });

  const scrapMutation = useMutation({
    mutationFn: (wasScrapped: boolean) =>
      wasScrapped
        ? contentsEndpoints.unscrapContent(content.id)
        : contentsEndpoints.scrapContent(content.id),
    onMutate: async (wasScrapped) => {
      await queryClient.cancelQueries({ queryKey: ["content", content.id] });
      const previous = queryClient.getQueryData<ContentDetailResponse>([
        "content",
        content.id,
      ]);
      updateContentInteractionCache(queryClient, content.id, "isScrapped", !wasScrapped);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["content", content.id], context?.previous);
      invalidateContentInteractionQueries(queryClient, content.id);
    },
    onSettled: () => {
      invalidateContentInteractionQueries(queryClient, content.id);
    },
  });

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/home/${content.id}`);
      toast.success("링크가 복사되었습니다.");
    }
  }, [content.id]);

  return (
    <article className="pb-20">
      {/* 뒤로가기 */}
      <Link
        href="/home"
        className="group/back mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        홈으로
      </Link>

      {/* 헤더 */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="flex-1 text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl">
            {content.title}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => {
                if (likeMutation.isPending) return;
                likeMutation.mutate(content.isLiked);
              }}
              className={cn(
                "rounded-lg p-2 transition-all duration-200 cursor-pointer",
                content.isLiked
                  ? "text-red-500 hover:text-red-400"
                  : "text-muted-foreground hover:text-foreground",
                likeMutation.isPending && "opacity-50",
              )}
              aria-label={content.isLiked ? "좋아요 취소" : "좋아요"}
            >
              <Heart className="h-5 w-5" fill={content.isLiked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => {
                if (scrapMutation.isPending) return;
                scrapMutation.mutate(content.isScrapped);
              }}
              className={cn(
                "rounded-lg p-2 transition-all duration-200 cursor-pointer",
                content.isScrapped
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground",
                scrapMutation.isPending && "opacity-50",
              )}
              aria-label={content.isScrapped ? "스크랩 해제" : "스크랩"}
            >
              <Bookmark
                className="h-5 w-5"
                fill={content.isScrapped ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:text-foreground cursor-pointer"
              aria-label="공유"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
          <span className="font-medium">{content.sourceName}</span>
          <span className="font-medium">{formatDate(content.publishedAt)}</span>
          {content.licenseType && (
            <span className="rounded-md px-1.5 py-0.5 text-xs font-medium">
              {content.licenseType}
            </span>
          )}
        </div>

        {/* 태그 */}
        {content.tags.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground/85 font-medium">
              {[...new Set(content.tags)].join(" · ")}
            </p>
          </div>
        )}
      </header>

      {/* AI 요약 */}
      <AiSummary contentId={content.id} />

      {/* 본문 */}
      <BlogDetailBody content={content} />
    </article>
  );
}
