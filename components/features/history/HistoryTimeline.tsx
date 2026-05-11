"use client";

import type { DateGroup } from "@/lib/history/groupByDate";
import CollapsibleTimelineByDate from "./CollapsibleTimelineByDate";
import HistoryTimelineItem from "./HistoryTimelineItem";

interface Props {
  groups: DateGroup[];
}

export default function HistoryTimeline({ groups }: Props) {
  return (
    <CollapsibleTimelineByDate
      groups={groups}
      renderGroupItems={(group) =>
        group.items.map((item, i) => (
          <HistoryTimelineItem
            key={item.id}
            item={item}
            isLast={i === group.items.length - 1}
          />
        ))
      }
    />
  );
}
