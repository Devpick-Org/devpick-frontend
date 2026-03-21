"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  historyEndpoints,
  HISTORY_QUERY_KEYS,
} from "@/lib/api/endpoints/history";
import type { HistoryActionType } from "@/types/history";
import {
  filterByPeriod,
  filterByActions,
  groupByDate,
  type PeriodFilter,
} from "@/lib/history/groupByDate";
import HistoryContent from "./HistoryContent";

const PAGE = 0;
const PAGE_SIZE = 100;

export default function HistoryPage() {
  const [selectedActions, setSelectedActions] = useState<HistoryActionType[]>([]);
  const [period, setPeriod] = useState<PeriodFilter>("30d");

  const { data, isLoading, isError } = useQuery({
    queryKey: HISTORY_QUERY_KEYS.list({ page: PAGE, size: PAGE_SIZE }),
    queryFn: () => historyEndpoints.getHistoryList({ page: PAGE, size: PAGE_SIZE }),
  });

  const allItems = data?.data.items ?? [];
  const filtered = filterByActions(filterByPeriod(allItems, period), selectedActions);
  const groups = isLoading || isError ? undefined : groupByDate(filtered);

  return (
    <HistoryContent
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
