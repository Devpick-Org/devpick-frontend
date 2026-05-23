"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** `public/trace-mark.png` — Trace 마스코트(베리) */
const TRACE_MARK = "/trace-mark.png";

const variants = {
  nav: {
    box: "h-9 w-9 rounded-md",
    size: 36,
    imgClass: "object-contain p-0.5",
    centered: false,
  },
  auth: {
    box: "h-12 w-12 rounded-xl",
    size: 48,
    imgClass: "object-contain p-1",
    centered: false,
  },
  /** 트렌드 카드 등 썸네일 없을 때 전체 영역 fallback */
  thumb: {
    box: "h-full w-full rounded-none bg-gradient-to-br from-primary/15 via-muted to-primary/8",
    size: 80,
    imgClass: "h-auto w-[38%] max-w-[88px] object-contain",
    centered: true,
  },
} as const;

export interface TraceMarkProps {
  variant?: keyof typeof variants;
  className?: string;
}

/**
 * 헤더·랜딩·인증 등에서 공통으로 쓰는 Trace 심벌 마크.
 */
export function TraceMark({ variant = "nav", className }: TraceMarkProps) {
  const v = variants[variant];
  const image = (
    <Image
      src={TRACE_MARK}
      alt={variant === "thumb" ? "" : "Trace"}
      width={v.size}
      height={v.size}
      className={cn(v.centered ? v.imgClass : cn("size-full", v.imgClass))}
      sizes={`${v.size}px`}
      priority={variant === "nav"}
    />
  );

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden",
        variant === "thumb"
          ? v.box
          : cn("bg-primary/10 ring-1 ring-primary/15", v.box),
        className,
      )}
      aria-hidden={variant === "thumb" ? true : undefined}
    >
      {v.centered ? (
        <div className="flex h-full w-full items-center justify-center">
          {image}
        </div>
      ) : (
        image
      )}
    </div>
  );
}
