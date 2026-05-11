"use client";

import { useCallback, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import type { DateGroup } from "@/lib/history/groupByDate";
import { cn } from "@/lib/utils";

type Props<T> = {
  groups: DateGroup<T>[];
  renderGroupItems: (group: DateGroup<T>) => ReactNode;
};

/**
 * 날짜별 그룹 헤더를 눌러 해당 날 아이템만 접거나 펼칩니다. 초기값은 모두 펼침.
 */
export default function CollapsibleTimelineByDate<T>({
  groups,
  renderGroupItems,
}: Props<T>) {
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((dateKey: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) next.delete(dateKey);
      else next.add(dateKey);
      return next;
    });
  }, []);

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const open = !collapsedKeys.has(group.dateKey);
        return (
          <div key={group.dateKey}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggle(group.dateKey)}
              className={cn(
                "sticky top-16 z-10 -mx-1 mb-1 flex w-full min-w-0 items-center gap-2 rounded-lg px-1 py-2 text-left",
                "bg-background/80 backdrop-blur-sm transition-colors hover:bg-muted/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  open ? "rotate-0" : "-rotate-90",
                )}
                aria-hidden
              />
              <span className="text-sm font-semibold text-foreground">{group.dateLabel}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {group.count}
              </span>
            </button>

            {open ? <div>{renderGroupItems(group)}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
