"use client";

import type { DateGroup } from "@/lib/history/groupByDate";
import type { ActivityItem } from "@/types/history";
import CollapsibleTimelineByDate from "./CollapsibleTimelineByDate";
import ActivityTimelineItem from "./ActivityTimelineItem";

interface Props {
  groups: DateGroup<ActivityItem>[];
}

export default function ActivityTimeline({ groups }: Props) {
  return (
    <CollapsibleTimelineByDate
      groups={groups}
      renderGroupItems={(group) =>
        group.items.map((item, i) => (
          <ActivityTimelineItem
            key={item.id}
            item={item}
            isLast={i === group.items.length - 1}
          />
        ))
      }
    />
  );
}
