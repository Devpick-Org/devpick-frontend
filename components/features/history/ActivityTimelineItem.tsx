"use client";

import Link from "next/link";

import type { ActivityItem } from "@/types/history";
import { ACTIVITY_ACTION_META } from "./history.constants";
import { cn, formatTime } from "@/lib/utils";

interface Props {
  item: ActivityItem;
  isLast: boolean;
}

/**
 * actionType별 이동 경로
 * - content_liked → /home/{content.id}
 * - answer_written / comment_created / answer_adopted → /community/{post.id}#answer-{answer.id}
 * - 참조 항목이 null(삭제됨)이면 null 반환 → 클릭 비활성화
 */
function getHref(item: ActivityItem): string | null {
  if (item.actionType === "content_liked") {
    return item.content?.id ? `/home/${item.content.id}` : null;
  }
  if (item.actionType === "daily_login") return null;
  // answer_written / answer_adopted / comment_created
  if (!item.post?.id) return null;
  if (item.answer?.id) return `/community/${item.post.id}#answer-${item.answer.id}`;
  return `/community/${item.post.id}`;
}

export default function ActivityTimelineItem({ item, isLast }: Props) {
  const meta = ACTIVITY_ACTION_META[item.actionType];
  const Icon = meta.icon;
  const href = getHref(item);
  const title =
    item.content?.title ??
    item.post?.title ??
    (item.actionType === "daily_login" ? "출석을 완료했어요" : null);
  const preview =
    item.actionType === "comment_created"
      ? (item.comment?.preview ?? null)
      : item.actionType === "content_liked"
        ? (item.content?.preview ?? null)
        : (item.answer?.preview ?? null);

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
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          {meta.label}
        </p>
        {title ? (
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
            {title}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">삭제된 콘텐츠</p>
        )}
        {preview && (
          <p className="text-xs font-medium text-muted-foreground mt-0.5 line-clamp-1">
            {preview}
          </p>
        )}
      </div>

      {/* 시간 + 포인트 */}
      <div className="shrink-0 flex flex-col items-end justify-between self-stretch gap-1">
        <time
          dateTime={item.createdAt}
          className="text-xs text-muted-foreground whitespace-nowrap"
        >
          {formatTime(item.createdAt)}
        </time>
        {item.points !== null && (
          <span className="text-xs font-semibold text-primary whitespace-nowrap">
            +{item.points}p
          </span>
        )}
      </div>
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
          <Icon
            className={cn(meta.iconSizeClass ?? "h-4 w-4", meta.iconClass)}
          />
        </div>
        {!isLast && <div className="w-px flex-1 min-h-3 bg-border mt-1" />}
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
