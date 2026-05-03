"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
  const initial = (item.title?.trim() ? item.title.trim() : "?").slice(0, 1);
  /** API에 저장된 썸네일 URL(api.devpick 에서 제공하는 목록 문자열 그대로) */
  const displayThumbnail = item.thumbnailUrl?.trim();
  const hasThumb = Boolean(displayThumbnail);
  const showImage = hasThumb && !thumbFailed;
  /** 동아리는 썸네일이 없거나 로드 실패 시 이미지 칸 없이 텍스트만 */
  const hideHero = item.category === "club" && (!hasThumb || thumbFailed);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url: item.detailUrl });
      } else {
        await navigator.clipboard.writeText(item.detailUrl);
      }
    } catch {
      /* 사용자 취소 등 무시 */
    }
  };

  return (
    <article
      className={cn(
        "flex w-[min(100vw-2rem,280px)] shrink-0 flex-col gap-2.5 rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md",
        hideHero && "gap-2",
        className,
      )}
    >
      {!hideHero && (
        <Link
          href={item.detailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted"
        >
          {showImage && displayThumbnail ? (
            item.category === "bootcamp" ? (
              // eslint-disable-next-line @next/next/no-img-element -- 부트캠퍼 _next/image는 서버 프록시(데이터센터 IP)보다 브라우저 직링크가 안정적
              <img
                src={displayThumbnail}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setThumbFailed(true)}
              />
            ) : (
              <Image
                src={displayThumbnail}
                alt=""
                fill
                sizes="280px"
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized={item.category === "club" || item.category === "event"}
                onError={() => setThumbFailed(true)}
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-primary/5 text-3xl font-bold text-primary/80">
              {initial}
            </div>
          )}
        </Link>
      )}
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
                void share();
              }}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="공유"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="북마크"
              onClick={(e) => e.preventDefault()}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Link
            href={item.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 min-w-0 flex-1 font-semibold leading-snug tracking-tight text-foreground underline-offset-2 hover:underline"
          >
            {item.title}
          </Link>
          <span className="mt-px shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
            {categoryBadge(item.category)}
          </span>
        </div>
        {item.subtitle ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.subtitle}</p>
        ) : (
          item.tags &&
          item.tags.length > 0 && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {item.tags.slice(0, 4).join(" · ")}
            </p>
          )
        )}
        <p className="truncate text-[10px] text-muted-foreground/80">출처 · {item.source}</p>
      </div>
    </article>
  );
}
