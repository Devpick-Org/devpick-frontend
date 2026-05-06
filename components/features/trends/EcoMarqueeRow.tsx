"use client";

import { useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EcoTrendCard } from "./EcoTrendCard";
import type { EcosystemTrendItemDto } from "@/types/trends";
import { cn } from "@/lib/utils";

type EcoMarqueeRowProps = {
  title: string;
  description?: string;
  items: EcosystemTrendItemDto[];
  onExpand: () => void;
  accentClass?: string;
  initialOffset?: number;
};

const SPEED = 0.35;
const CARD_SCROLL = 300;

export function EcoMarqueeRow({
  title,
  description,
  items,
  onExpand,
  accentClass,
  initialOffset = 0,
}: EcoMarqueeRowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const posRef = useRef(0);

  const duplicated = [...items, ...items];

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    posRef.current = initialOffset;

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        wrap.scrollLeft = posRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const scroll = (dir: 1 | -1) => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    pausedRef.current = true;
    wrap.scrollBy({ left: dir * CARD_SCROLL, behavior: "smooth" });

    setTimeout(() => {
      posRef.current = wrap.scrollLeft;
      const half = track.scrollWidth / 2;
      if (posRef.current >= half) posRef.current -= half;
      if (posRef.current < 0) posRef.current += half;
      pausedRef.current = false;
    }, 350);
  };

  return (
    <section className={cn("space-y-3", accentClass)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onExpand}
          className="flex cursor-pointer items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          전체보기
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center text-sm text-muted-foreground">
          조건에 맞는 항목이 없습니다.
        </p>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="이전"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>

          <div
            ref={wrapRef}
            className="eco-marquee-wrap overflow-x-scroll rounded-xl border border-border/50 bg-muted/20 py-2"
          >
            <div
              ref={trackRef}
              className="eco-marquee-track flex w-max select-none gap-4 pr-4"
            >
              {duplicated.map((item, i) => (
                <EcoTrendCard
                  key={`${item.id}-${i}-${item.thumbnailUrl ?? ""}`}
                  item={item}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="다음"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </div>
      )}
    </section>
  );
}
