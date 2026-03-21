"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  historyEndpoints,
  HISTORY_QUERY_KEYS,
} from "@/lib/api/endpoints/history";
import type { ActivityActionType } from "@/types/history";
import {
  filterByPeriod,
  filterByActivityActions,
  groupByActivityDate,
  type PeriodFilter,
} from "@/lib/history/groupByDate";
import ActivityContent from "./ActivityContent";

const PAGE = 0;
const PAGE_SIZE = 100;

export default function ActivityPage() {
  const [selectedActions, setSelectedActions] = useState<ActivityActionType[]>([]);
  const [period, setPeriod] = useState<PeriodFilter>("30d");

  const { data, isLoading, isError } = useQuery({
    queryKey: HISTORY_QUERY_KEYS.activityList({ page: PAGE, size: PAGE_SIZE }),
    queryFn: () => historyEndpoints.getActivityList({ page: PAGE, size: PAGE_SIZE }),
  });

  const allItems = data?.data.items ?? [];
  const filtered = filterByActivityActions(filterByPeriod(allItems, period), selectedActions);
  const groups = isLoading || isError ? undefined : groupByActivityDate(filtered);

  return (
    <ActivityContent
      groups={groups}
      isLoading={isLoading}
      isError={isError}
      selectedActions={selectedActions}
      onActionsChange={setSelectedActions}
      period={period}
      onPeriodChange={setPeriod}
    />
  );
}
