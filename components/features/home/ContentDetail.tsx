"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Bookmark, Share2, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, formatDate } from "@/lib/utils";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import {
  updateContentInteractionCache,
  invalidateContentInteractionQueries,
} from "@/lib/content/updateContentInteractionCache";
import type {
  ContentDetail as ContentDetailType,
  ContentDetailResponse,
} from "@/types/content";
import { AiSummary } from "./AiSummary";
import { toast } from "sonner";

// ─── 마크다운 렌더러 ───────────────────────────────────────────────────────────

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-sm text-primary"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <div
          key={key++}
          className="my-6 overflow-hidden rounded-xl border border-border"
        >
          {lang && (
            <div className="flex items-center gap-2 border-b border-border bg-secondary/80 px-4 py-2">
              <span className="font-mono text-xs font-medium text-muted-foreground">
                {lang}
              </span>
            </div>
          )}
          <pre className="overflow-x-auto bg-[#0d1117] p-4">
            <code className="block font-mono text-sm leading-relaxed text-[#e6edf3]">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="mb-4 mt-10 text-xl font-bold tracking-tight text-foreground first:mt-0 md:text-2xl"
        >
          {line.replace("## ", "")}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="mb-3 mt-8 text-lg font-semibold text-foreground"
        >
          {line.replace("### ", "")}
        </h3>,
      );
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="my-4 ml-6 list-decimal space-y-2">
          {listItems.map((item, idx) => (
            <li
              key={idx}
              className="text-base leading-relaxed text-foreground/85"
            >
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        listItems.push(lines[i].trim().replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 ml-6 list-disc space-y-2">
          {listItems.map((item, idx) => (
            <li
              key={idx}
              className="text-base leading-relaxed text-foreground/85"
            >
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p key={key++} className="my-4 text-base leading-7 text-foreground/85">
        <InlineMarkdown text={line} />
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

// ─── ContentDetail ────────────────────────────────────────────────────────────

interface ContentDetailProps {
  content: ContentDetailType;
}

export function ContentDetail({ content }: ContentDetailProps) {
  const queryClient = useQueryClient();

  // mutate(wasLiked) — 클릭 직전 상태를 variable로 넘겨 onMutate/mutationFn이 같은 기준으로 동작
  const likeMutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked
        ? contentsEndpoints.unlikeContent(content.id)
        : contentsEndpoints.likeContent(content.id),
    onMutate: async (wasLiked) => {
      // 진행 중인 상세 refetch가 optimistic update를 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({ queryKey: ["content", content.id] });
      const previous = queryClient.getQueryData<ContentDetailResponse>([
        "content",
        content.id,
      ]);
      // 상세 + 목록/검색 + 추천 캐시를 동시에 반영
      updateContentInteractionCache(queryClient, content.id, "isLiked", !wasLiked);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      // 상세 캐시 스냅샷 복구 후 나머지는 invalidate로 서버 상태 복원
      queryClient.setQueryData(["content", content.id], context?.previous);
      invalidateContentInteractionQueries(queryClient, content.id);
    },
    onSettled: () => {
      invalidateContentInteractionQueries(queryClient, content.id);
    },
  });

  // mutate(wasScrapped) — 같은 패턴
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
      navigator.clipboard.writeText(
        `${window.location.origin}/home/${content.id}`,
      );
      toast.success("링크가 복사되었습니다.");
    }
  }, [content.id]);

  const body = content.originalContent ?? content.preview;

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
                "rounded-lg p-2 transition-all duration-200",
                content.isLiked
                  ? "text-red-500 hover:text-red-400"
                  : "text-muted-foreground hover:text-foreground",
                likeMutation.isPending && "opacity-50",
              )}
              aria-label={content.isLiked ? "좋아요 취소" : "좋아요"}
            >
              <Heart
                className="h-5 w-5"
                fill={content.isLiked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => {
                if (scrapMutation.isPending) return;
                scrapMutation.mutate(content.isScrapped);
              }}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
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
              className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:text-foreground"
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
          <p className="mt-4 text-sm text-muted-foreground/85 font-medium">
            {content.tags.join(" · ")}
          </p>
        )}
      </header>

      {/* AI 요약 */}
      <AiSummary contentId={content.id} />

      {/* 본문 */}
      <section className="mb-12 font-medium">
        <ContentRenderer content={body} />
      </section>

      {/* 원문 링크 CTA */}
      <section className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-8">
        <p className="text-sm text-muted-foreground font-medium">
          저작권 보호를 위해 본문의 일부만 제공됩니다.
        </p>
        <a
          href={content.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
        >
          <ExternalLink className="h-4 w-4" />
          원문 보러 가기
        </a>
      </section>
    </article>
  );
}
