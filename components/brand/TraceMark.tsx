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
  },
  auth: {
    box: "h-12 w-12 rounded-xl",
    size: 48,
    imgClass: "object-contain p-1",
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
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-primary/10 ring-1 ring-primary/15",
        v.box,
        className,
      )}
    >
      <Image
        src={TRACE_MARK}
        alt="Trace"
        width={v.size}
        height={v.size}
        className={cn("size-full", v.imgClass)}
        sizes={`${v.size}px`}
        priority={variant === "nav"}
      />
    </div>
  );
}
