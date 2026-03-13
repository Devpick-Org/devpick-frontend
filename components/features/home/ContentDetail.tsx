"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Bookmark, Share2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useContentStore } from "@/store/content.store";
import type { ContentDetail as ContentDetailType } from "@/types/content";

// ─── 태그 색상 ────────────────────────────────────────────────────────────────

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
  return TAG_COLORS[tag] ?? "border-primary/20 bg-primary/5 text-primary/80";
}

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
  const { init, toggleLike, toggleScrap, interactions } = useContentStore();
  const [isShareTooltip, setIsShareTooltip] = useState(false);

  useEffect(() => {
    init(content.id, content.isLiked, content.isScrapped);
  }, [content.id, content.isLiked, content.isScrapped, init]);

  const interaction = interactions[content.id];
  const isLiked = interaction?.isLiked ?? content.isLiked;
  const isScrapped = interaction?.isScrapped ?? content.isScrapped;

  const handleShare = useCallback(() => {
    setIsShareTooltip(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/home/${content.id}`,
      );
    }
    setTimeout(() => setIsShareTooltip(false), 1500);
  }, [content.id]);

  const body = content.originalContent ?? content.preview;

  return (
    <article className="pb-20">
      {/* 뒤로가기 */}
      <Link
        href="/home"
        className="group/back mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
              onClick={() => toggleLike(content.id)}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
                isLiked
                  ? "text-red-500 hover:text-red-400"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            >
              <Heart
                className="h-5 w-5"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => toggleScrap(content.id)}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
                isScrapped
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
            >
              <Bookmark
                className="h-5 w-5"
                fill={isScrapped ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="relative rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
              aria-label="공유"
            >
              <Share2 className="h-5 w-5" />
              {isShareTooltip && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
                  복사됨!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
          <span className="font-medium">{content.sourceName}</span>
          <span className="text-border">·</span>
          <span>{formatDate(content.publishedAt)}</span>
          {content.licenseType && (
            <>
              <span className="text-border">·</span>
              <span className="rounded-md border border-border px-1.5 py-0.5 text-xs">
                {content.licenseType}
              </span>
            </>
          )}
        </div>

        {/* 태그 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {content.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium",
                getTagColor(tag),
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* 본문 */}
      <section className="mb-12">
        <ContentRenderer content={body} />
      </section>

      {/* 원문 링크 CTA */}
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-8">
        <p className="text-sm text-muted-foreground">
          저작권 보호를 위해 본문의 일부만 제공됩니다.
        </p>
        <a
          href={content.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30"
        >
          <ExternalLink className="h-4 w-4" />
          원문 보러 가기
        </a>
      </section>
    </article>
  );
}
