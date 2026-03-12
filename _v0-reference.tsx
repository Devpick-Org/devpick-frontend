"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FeedItem } from "@/lib/feed-data";

/* ── SVG Icons ── */

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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

function SparklesIcon({ className }: { className?: string }) {
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
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
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
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.3 9.3" />
      <path d="M18.5 5.5 21 3" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

/* ── Tag colors ── */
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

/* ── Markdown-like content renderer ── */

function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div
          key={key++}
          className="my-6 overflow-hidden rounded-xl border border-border"
        >
          {lang && (
            <div className="flex items-center gap-2 border-b border-border bg-secondary/80 px-4 py-2">
              <CodeIcon className="h-3.5 w-3.5 text-muted-foreground" />
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

    // h2
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

    // h3
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

    // Ordered list
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

    // Unordered list
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

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="my-4 text-base leading-7 text-foreground/85">
        <InlineMarkdown text={line} />
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

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

/* ── Main component ── */

export function PostDetail({ item }: { item: FeedItem }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isScrapped, setIsScrapped] = useState(item.isScrapped || false);
  const [isShareTooltip, setIsShareTooltip] = useState(false);

  const handleShare = useCallback(() => {
    setIsShareTooltip(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://devpick.dev/content/${item.id}`);
    }
    setTimeout(() => setIsShareTooltip(false), 1500);
  }, [item.id]);

  return (
    <article className="px-4 pt-8 pb-20 lg:px-0">
      {/* Back button */}
      <Link
        href="/home"
        className="group/back mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        {"홈으로"}
      </Link>

      {/* ── Header ── */}
      <header className="mb-8">
        {/* Title and actions row */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="flex-1 text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl">
            {item.title}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setIsLiked((p) => !p)}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
                isLiked
                  ? "text-red-500 hover:text-red-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            >
              <HeartIcon className="h-5 w-5" filled={isLiked} />
            </button>
            <button
              onClick={() => setIsScrapped((p) => !p)}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
                isScrapped
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
            >
              <BookmarkIcon className="h-5 w-5" filled={isScrapped} />
            </button>
            <button
              onClick={handleShare}
              className="relative rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary"
              aria-label="공유"
            >
              <ShareIcon className="h-5 w-5" />
              {isShareTooltip && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
                  {"복사됨!"}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span className="font-medium">{item.source}</span>
          <span className="text-border">{"/"}</span>
          <span>{item.timeAgo}</span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
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

      {/* ── AI Summary ── */}
      <section className="mb-10 overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.03]">
        {/* Summary header */}
        <div className="flex items-center gap-2.5 border-b border-primary/10 px-5 py-3.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <SparklesIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {"AI 핵심 요약"}
          </span>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* Keywords */}
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-primary/70" />
              <span className="text-sm font-semibold text-foreground">
                {"키워드"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.aiSummary.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Core Concepts */}
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4 text-amber-500/80" />
              <span className="text-sm font-semibold text-foreground">
                {"핵심 개념"}
              </span>
            </div>
            <ul className="space-y-2">
              {item.aiSummary.coreConcepts.map((concept, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60" />
                  {concept}
                </li>
              ))}
            </ul>
          </div>

          {/* Code Points */}
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <CodeIcon className="h-4 w-4 text-emerald-500/80" />
              <span className="text-sm font-semibold text-foreground">
                {"코드 포인트"}
              </span>
            </div>
            <ul className="space-y-2">
              {item.aiSummary.codePoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/60" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="mb-12">
        <ContentRenderer content={item.content} />
      </section>

      {/* ── CTA: View Original ── */}
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-8">
        <p className="text-sm text-muted-foreground">
          {"저작권 보호를 위해 본문의 일부만 제공됩니다."}
        </p>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30"
        >
          <GlobeIcon className="h-4.5 w-4.5" />
          {"원문 보러 가기"}
        </a>
      </section>
    </article>
  );
}
