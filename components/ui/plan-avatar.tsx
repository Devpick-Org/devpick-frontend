"use client";

import type { PlanType } from "@/types/subscription";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PlanAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE: Record<
  PlanAvatarSize,
  { outer: string; avatar: string; sparkle: string; fallback: string }
> = {
  xs: {
    outer: "size-8",
    avatar: "size-[26px]",
    sparkle: "text-[5px]",
    fallback: "text-xs",
  },
  sm: {
    outer: "size-7",
    avatar: "size-[22px]",
    sparkle: "text-[6px]",
    fallback: "text-xs",
  },
  md: {
    outer: "size-9",
    avatar: "size-[30px]",
    sparkle: "text-[7px]",
    fallback: "text-xs",
  },
  lg: {
    outer: "size-24",
    avatar: "size-[88px]",
    sparkle: "text-sm",
    fallback: "text-2xl font-bold",
  },
  xl: {
    outer: "size-14",
    avatar: "size-[50px]",
    sparkle: "text-[9px]",
    fallback: "text-lg",
  },
};

function Sparkle({
  className,
  sizeClass,
}: {
  className?: string;
  sizeClass: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute leading-none text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]",
        sizeClass,
        className,
      )}
    >
      ✦
    </span>
  );
}

interface PlanAvatarProps {
  planType?: PlanType | null;
  src?: string | null;
  alt?: string;
  fallback: string;
  size?: PlanAvatarSize;
  className?: string;
}

export function PlanAvatar({
  planType = "FREE",
  src,
  alt,
  fallback,
  size = "sm",
  className,
}: PlanAvatarProps) {
  const dims = SIZE[size];
  const hasImage = Boolean(src && !src.startsWith("blob:"));
  const initial = fallback.charAt(0).toUpperCase();

  if (planType !== "PRO" && planType !== "MAX") {
    return (
      <Avatar className={cn(dims.outer, "ring-1 ring-primary/20", className)}>
        {hasImage && <AvatarImage src={src!} alt={alt ?? fallback} />}
        <AvatarFallback
          className={cn(
            "bg-primary/15 font-semibold text-primary",
            dims.fallback,
          )}
        >
          {initial}
        </AvatarFallback>
      </Avatar>
    );
  }

  const isMax = planType === "MAX";

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full",
        dims.outer,
        isMax ? "plan-avatar-max" : "plan-avatar-pro",
        className,
      )}
      title={isMax ? "Max 플랜" : "Pro 플랜"}
    >
      {isMax ? (
        <>
          <Sparkle className="-top-0.5 left-1/2 -translate-x-1/2" sizeClass={dims.sparkle} />
          <Sparkle className="top-0.5 right-0" sizeClass={dims.sparkle} />
          <Sparkle className="bottom-1 left-0" sizeClass={dims.sparkle} />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-0.5 -right-0.5 text-[10px] leading-none drop-shadow-sm"
          >
            🌊
          </span>
        </>
      ) : (
        <Sparkle className="-top-0.5 right-0.5" sizeClass={dims.sparkle} />
      )}

      <div className="plan-avatar-ring flex size-full items-center justify-center rounded-full p-[2px]">
        <Avatar className={cn(dims.avatar, "ring-2 ring-background")}>
          {hasImage && <AvatarImage src={src!} alt={alt ?? fallback} />}
          <AvatarFallback
            className={cn(
              "bg-primary/15 font-semibold text-primary",
              dims.fallback,
            )}
          >
            {initial}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
