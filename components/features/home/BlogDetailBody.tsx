import Link from "next/link";
import { ExternalLink, Brain } from "lucide-react";
import { ContentRenderer } from "./ContentRenderer";
import type { ContentDetail } from "@/types/content";

interface BlogDetailBodyProps {
  content: ContentDetail;
}

export function BlogDetailBody({ content }: BlogDetailBodyProps) {
  const body = content.originalContent ?? content.preview;

  return (
    <>
      <section className="mb-12 font-medium">
        <ContentRenderer content={body} />
      </section>

      <section className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-8">
        <p className="text-sm text-muted-foreground font-medium">
          저작권 보호를 위해 본문의 일부만 제공됩니다.
        </p>
        <div className="flex gap-3">
          <Link
            href={`/home/${content.id}/quiz`}
            className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
          >
            <Brain className="h-4 w-4" />
            AI 퀴즈 풀기
          </Link>
          <a
            href={content.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/5"
          >
            <ExternalLink className="h-4 w-4" />
            원문 보러 가기
          </a>
        </div>
      </section>
    </>
  );
}
