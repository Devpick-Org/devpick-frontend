"use client";

import Link from "next/link";
import { ExternalLink, Brain } from "lucide-react";
import { ContentRenderer as HtmlContentRenderer } from "./ContentRenderer";
import { ContentRenderer as MarkdownContentRenderer } from "@/components/features/community/ContentRenderer";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import type { ContentDetail } from "@/types/content";

/** Velog GraphQL `body`는 마크다운 — HTML sanitizer 경로로 넣으면 깨짐 (DP-313) */
function isVelogSource(sourceName: string) {
  return sourceName.trim().toLowerCase() === "velog";
}

interface BlogDetailBodyProps {
  content: ContentDetail;
}

export function BlogDetailBody({ content }: BlogDetailBodyProps) {
  const handleReadOriginal = () => {
    contentsEndpoints.readOriginal(content.id).catch(() => {});
  };

  const useMarkdown = isVelogSource(content.sourceName);

  return (
    <>
      {content.isOriginalVisible && content.originalContent && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-foreground">원문</h2>
          {useMarkdown ? (
            <MarkdownContentRenderer
              content={content.originalContent}
              className="text-base leading-7 text-foreground/85 font-medium"
            />
          ) : (
            <HtmlContentRenderer content={content.originalContent} />
          )}
        </section>
      )}

      <section className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-8">
        {!content.originalContent && (
          <p className="text-sm text-muted-foreground font-medium">
            저작권 보호를 위해 본문이 제공되지 않습니다.
          </p>
        )}
        <div className="flex gap-3">
          <Link
            href={`/home/${content.id}/quiz`}
            className="inline-flex items-center gap-2.5 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-secondary/80"
          >
            <Brain className="h-4 w-4" />
            AI 퀴즈 풀기
          </Link>
          <a
            href={content.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleReadOriginal}
            className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
          >
            <ExternalLink className="h-4 w-4" />
            원문 보러 가기
          </a>
        </div>
      </section>
    </>
  );
}
