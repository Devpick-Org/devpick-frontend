"use client";

import Link from "next/link";

import type { HistoryItem } from "@/types/history";
import { ACTION_META } from "./history.constants";
import { cn, formatTime } from "@/lib/utils";

interface Props {
  item: HistoryItem;
  isLast: boolean;
}

function getHref(item: HistoryItem): string | null {
  if (item.content?.id) return `/home/${item.content.id}`;
  if (item.post?.id) return `/community/${item.post.id}`;
  return null;
}

export default function HistoryTimelineItem({ item, isLast }: Props) {
  const meta = ACTION_META[item.actionType];
  const Icon = meta.icon;
  const href = getHref(item);
  const title = item.content?.title ?? item.post?.title ?? null;
  const preview = item.content?.preview ?? null;

  const card = (
    <div
      className={cn(
        "bg-card border border-border rounded-xl px-4 py-3",
        "flex items-start justify-between gap-3",
        href && "transition-colors hover:bg-muted/40",
      )}
    >
      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{meta.label}</p>
        {title ? (
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-1">
            {title}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">삭제된 콘텐츠</p>
        )}
        {preview && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{preview}</p>
        )}
      </div>

      {/* 시간 */}
      <time
        dateTime={item.createdAt}
        className="shrink-0 text-xs text-muted-foreground mt-0.5 whitespace-nowrap"
      >
        {formatTime(item.createdAt)}
      </time>
    </div>
  );

  return (
    <div className="flex gap-3 items-center">
      {/* 타임라인 왼쪽: 아이콘 노드 + 세로 연결선 */}
      <div className="flex flex-col items-center shrink-0 w-8">
        <div
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 relative z-10",
            meta.iconBgClass,
          )}
        >
          <Icon className={cn("h-4 w-4", meta.iconClass)} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-3 bg-border mt-1" />
        )}
      </div>

      {/* 오른쪽: 카드 */}
      <div className={cn("flex-1 min-w-0", !isLast && "pb-4")}>
        {href ? (
          <Link href={href} className="block">
            {card}
          </Link>
        ) : (
          card
        )}
      </div>
    </div>
  );
}
