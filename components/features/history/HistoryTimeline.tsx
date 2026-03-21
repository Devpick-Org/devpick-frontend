"use client";

import type { DateGroup } from "@/lib/history/groupByDate";
import HistoryTimelineItem from "./HistoryTimelineItem";

interface Props {
  groups: DateGroup[];
}

export default function HistoryTimeline({ groups }: Props) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.dateKey}>
          {/* 날짜 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-foreground">
              {group.dateLabel}
            </span>
            <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {group.count}
            </span>
          </div>

          {/* 타임라인 아이템 */}
          <div>
            {group.items.map((item, i) => (
              <HistoryTimelineItem
                key={item.id}
                item={item}
                isLast={i === group.items.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
