"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { TraceMark } from "@/components/brand/TraceMark";
import { cn, copyShareLink } from "@/lib/utils";
import type { EcosystemTrendItemDto } from "@/types/trends";

type EcoTrendCardProps = {
  item: EcosystemTrendItemDto;
  className?: string;
};

function categoryBadge(category: EcosystemTrendItemDto["category"]): string {
  switch (category) {
    case "bootcamp":
      return "부트캠프";
    case "club":
      return "동아리";
    case "event":
      return "행사";
    default:
      return "";
  }
}

export function EcoTrendCard({ item, className }: EcoTrendCardProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const displayThumbnail = item.thumbnailUrl?.trim();
  const showImage = Boolean(displayThumbnail) && !thumbFailed;

  return (
    <article
      className={cn(
        "relative flex w-[min(100vw-2rem,280px)] shrink-0 flex-col gap-2.5 rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <Link
        href={item.detailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={item.title}
      />
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
        {showImage && displayThumbnail ? (
          <Image
            src={displayThumbnail}
            alt=""
            fill
            sizes="280px"
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized={
              item.category === "club" || item.category === "event"
            }
            onError={() => setThumbFailed(true)}
          />
        ) : (
          <TraceMark variant="thumb" />
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-0.5 pb-1">
        <div className="flex items-start justify-between gap-2">
          <span className="line-clamp-1 text-xs font-medium text-primary/90">
            {item.organizer}
          </span>
          <div className="flex shrink-0 gap-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                copyShareLink(item.detailUrl);
              }}
              className="relative z-10 cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="공유"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <p className="line-clamp-2 min-h-[2.75em] min-w-0 flex-1 font-semibold leading-snug tracking-tight text-foreground">
            {item.title}
          </p>
          <span className="mt-px shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
            {categoryBadge(item.category)}
          </span>
        </div>
        {item.subtitle ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {item.subtitle}
          </p>
        ) : (
          item.tags &&
          item.tags.length > 0 && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {item.tags.slice(0, 4).join(" · ")}
            </p>
          )
        )}
        <p className="truncate text-[10px] text-muted-foreground/80">
          출처 · {item.source}
        </p>
      </div>
    </article>
  );
}
