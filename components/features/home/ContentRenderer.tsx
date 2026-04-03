"use client";

import { useMemo } from "react";
import DOMPurify, { type Config } from "dompurify";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { Skeleton } from "@/components/ui/skeleton";

const DOMPURIFY_CONFIG: Config = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ["script", "style"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
};

export function ContentRenderer({ content }: { content: string }) {
  const mounted = useHydrated();

  const sanitized = useMemo(() => {
    if (!mounted) return "";
    return DOMPurify.sanitize(content, DOMPURIFY_CONFIG) as string;
  }, [content, mounted]);

  if (!content?.trim()) {
    return <p className="text-sm text-muted-foreground">본문이 없습니다.</p>;
  }

  if (!mounted) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[88%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[82%]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-foreground/85 leading-7",
        // 제목
        "[&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_h4]:mt-4 [&_h4]:mb-1.5 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-foreground",
        // 단락
        "[&_p]:my-4 [&_p]:leading-7",
        // 리스트
        "[&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1.5",
        "[&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-1.5",
        "[&_li]:leading-relaxed",
        // 인용
        "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        // 인라인 코드
        "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-secondary [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:text-primary",
        // 코드 블록
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#0d1117] [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-sm [&_pre_code]:leading-relaxed [&_pre_code]:text-[#e6edf3]",
        // 링크
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80",
        // 이미지
        "[&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-lg",
        // 구분선
        "[&_hr]:my-8 [&_hr]:border-border",
        // strong / em
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic",
        // 테이블
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
