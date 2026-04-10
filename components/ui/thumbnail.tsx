"use client";

import Image from "next/image";
import { useState, type SyntheticEvent } from "react";
import { cn } from "@/lib/utils";

interface ThumbnailProps {
  src: string;
  alt: string;
  fit?: "cover" | "contain" | "auto";
  ratio?: "square" | "landscape" | "classic" | "video";
  sizes?: string;
  className?: string;
}

const RATIO_CLASS: Record<NonNullable<ThumbnailProps["ratio"]>, string> = {
  square: "aspect-square",
  landscape: "aspect-[5/4]",
  classic: "aspect-[4/3]",
  video: "aspect-video",
};

export function Thumbnail({
  src,
  alt,
  fit = "cover",
  ratio = "landscape",
  sizes = "(max-width: 768px) 100vw, 740px",
  className,
}: ThumbnailProps) {
  const [resolvedFit, setResolvedFit] = useState<"cover" | "contain">(
    fit === "auto" ? "cover" : fit,
  );

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (fit !== "auto") return;
    const img = e.currentTarget;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    setResolvedFit(imageRatio < 1 ? "contain" : "cover");
  };

  const ratioClass = RATIO_CLASS[ratio];
  const isContain = resolvedFit === "contain";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        ratioClass,
        className,
      )}
    >
      {/* Blurred background — contain일 때만 렌더링 */}
      {isContain && (
        <Image
          src={src}
          alt=""
          fill
          aria-hidden
          className="object-cover scale-110 blur-xl brightness-50"
          sizes={sizes}
        />
      )}

      {/* 원본 이미지 */}
      <Image
        src={src}
        alt={alt}
        fill
        className={isContain ? "object-contain" : "object-cover"}
        sizes={sizes}
        onLoad={handleLoad}
      />
    </div>
  );
}
