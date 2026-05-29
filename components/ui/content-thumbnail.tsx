"use client";

import Image from "next/image";
import { useState } from "react";
import { TraceMark } from "@/components/brand/TraceMark";
import { cn } from "@/lib/utils";

export function isUsableThumbnailUrl(url?: string | null): url is string {
  return Boolean(url?.trim());
}

interface ContentThumbnailProps {
  thumbnailUrl?: string | null;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  sizes?: string;
  referrerPolicy?: React.ComponentProps<typeof Image>["referrerPolicy"];
  unoptimized?: boolean;
}

/**
 * 콘텐츠 썸네일 — URL 없음·로드 실패 시 Trace 마크 fallback (EcoTrendCard와 동일).
 */
export function ContentThumbnail({
  thumbnailUrl,
  alt,
  containerClassName,
  imageClassName = "object-cover",
  sizes = "(max-width: 768px) 100vw, 288px",
  referrerPolicy,
  unoptimized,
}: ContentThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const src = thumbnailUrl?.trim();
  const showRemote = isUsableThumbnailUrl(src) && !failed;

  return (
    <div
      className={cn("relative overflow-hidden bg-secondary", containerClassName)}
    >
      {showRemote ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClassName}
          sizes={sizes}
          referrerPolicy={referrerPolicy}
          unoptimized={unoptimized}
          onError={() => setFailed(true)}
        />
      ) : (
        <TraceMark variant="thumb" />
      )}
    </div>
  );
}
