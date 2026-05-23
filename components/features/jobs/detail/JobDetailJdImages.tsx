"use client";

import { useState } from "react";
import Image from "next/image";
import type { JobParseStatus } from "@/types/jobs";

interface JobDetailJdImagesProps {
  urls: string[];
  parseStatus: JobParseStatus;
  /** 인포그래픽이 본문 전부일 때 짧은 제목·설명만 사용 */
  compact?: boolean;
}

/**
 * 원문이 인포그래픽 등 이미지로만 제공될 때, 수집된 URL을 상세에 표시합니다.
 * 이미지는 새 탭 링크로 감싸지 않습니다(403 HTML 페이지로 이동하는 문제 방지).
 */
export function JobDetailJdImages({
  urls,
  parseStatus,
  compact = false,
}: JobDetailJdImagesProps) {
  const cleaned = urls.map((u) => u.trim()).filter(Boolean);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  if (!cleaned.length) return null;

  const isImageJd = parseStatus === "SKIPPED_IMAGE";
  const visibleCount = cleaned.filter((_, i) => !failed[i]).length;

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          {compact ? "공고 본문" : "공고 상세 (이미지)"}
        </h2>
        {isImageJd && !compact && (
          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
            일부 회사는 채용 내용을 텍스트 대신 이미지로만 게시합니다. 수집된 원문 이미지를
            그대로 보여 드립니다.
          </p>
        )}
        {compact && (
          <p className="mt-1 text-xs text-muted-foreground">
            상세 내용은 아래 이미지에 포함되어 있습니다.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {cleaned.map((src, i) =>
          failed[i] ? null : (
            <div
              key={`${src}-${i}`}
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
                  onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
                />
              </div>
            </div>
          ),
        )}
        {visibleCount === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
            공고 이미지를 불러올 수 없습니다. 상단의 「원문 보기」에서 랠릿 공고를 확인해 주세요.
          </p>
        )}
      </div>
    </section>
  );
}
