"use client";

import { EcoTrendCard } from "./EcoTrendCard";
import type { EcosystemTrendItemDto } from "@/types/trends";
import { cn } from "@/lib/utils";

type EcoMarqueeRowProps = {
  title: string;
  description?: string;
  items: EcosystemTrendItemDto[];
  onExpand: () => void;
  accentClass?: string;
};

export function EcoMarqueeRow({
  title,
  description,
  items,
  onExpand,
  accentClass,
}: EcoMarqueeRowProps) {
  const duplicated = [...items, ...items];
  /** 한 줄이 너무 빨리 움직이지 않도록 하한을 길게 둠 (항목 많을수록 조금 더 길게). */
  const durationSec = Math.min(180, Math.max(70, items.length * 22));

  return (
    <section className={cn("space-y-3", accentClass)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onExpand}
          className="shrink-0 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          전체보기
        </button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center text-sm text-muted-foreground">
          조건에 맞는 항목이 없습니다.
        </p>
      ) : (
        <div className="eco-marquee-wrap relative overflow-hidden rounded-xl border border-border/50 bg-muted/20 py-2">
          <div
            className="eco-marquee-track flex w-max gap-4 pr-4"
            style={{ ["--eco-marquee-duration" as string]: `${durationSec}s` }}
          >
            {duplicated.map((item, i) => (
              <EcoTrendCard key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
