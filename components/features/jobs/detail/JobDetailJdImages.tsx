"use client";

import Image from "next/image";
import type { JobParseStatus } from "@/types/jobs";

interface JobDetailJdImagesProps {
  urls: string[];
  parseStatus: JobParseStatus;
}

/**
 * 원문이 인포그래픽 등 이미지로만 제공될 때, 수집된 URL을 상세에 표시합니다.
 */
export function JobDetailJdImages({ urls, parseStatus }: JobDetailJdImagesProps) {
  const cleaned = urls.map((u) => u.trim()).filter(Boolean);
  if (!cleaned.length) return null;

  const isImageJd = parseStatus === "SKIPPED_IMAGE";

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-foreground">공고 상세 (이미지)</h2>
        {isImageJd && (
          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
            일부 회사는 채용 내용을 텍스트 대신 이미지로만 게시합니다. 수집된 원문 이미지를
            그대로 보여 드립니다.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {cleaned.map((src, i) => (
          <a
            key={`${src}-${i}`}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block overflow-hidden rounded-xl border border-border bg-muted/30"
          >
            <div className="relative w-full">
              <Image
                src={src}
                alt={`채용 공고 상세 이미지 ${i + 1}`}
                width={1200}
                height={1600}
                className="h-auto w-full object-contain"
                unoptimized
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
            <span className="sr-only">새 탭에서 이미지 원본 열기</span>
          </a>
        ))}
      </div>
    </section>
  );
}
