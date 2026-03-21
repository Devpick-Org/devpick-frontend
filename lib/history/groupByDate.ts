import type { HistoryItem, HistoryActionType } from "@/types/history";

export type PeriodFilter = "7d" | "30d" | "all";

/** 날짜별 그룹 — HistoryTimeline에서 사용 */
export interface DateGroup {
  dateKey: string;   // "2026-03-21" — 정렬/식별 키
  dateLabel: string; // "2026년 3월 21일" — 화면 표시
  count: number;
  items: HistoryItem[];
}

/** ISO 문자열 → 로컬 "YYYY-MM-DD" 키 */
function toLocalDateKey(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM-DD" → "2026년 3월 21일" */
function toLocalDateLabel(dateKey: string): string {
  // T00:00:00 붙여 UTC 해석 방지
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** period 필터 — createdAt 로컬 날짜 기준 */
export function filterByPeriod(
  items: HistoryItem[],
  period: PeriodFilter,
): HistoryItem[] {
  if (period === "all") return items;
  const days = period === "7d" ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return items.filter((item) => new Date(item.createdAt) >= cutoff);
}

/** actionType 필터 — selectedActions가 비어 있으면 전체 반환 */
export function filterByActions(
  items: HistoryItem[],
  selectedActions: HistoryActionType[],
): HistoryItem[] {
  if (selectedActions.length === 0) return items;
  return items.filter((item) => selectedActions.includes(item.actionType));
}

/** createdAt 기준 로컬 날짜별 그룹핑 (날짜: 최신순 / 그룹 내 아이템: 최신순) */
export function groupByDate(items: HistoryItem[]): DateGroup[] {
  const map = new Map<string, HistoryItem[]>();

  for (const item of items) {
    const key = toLocalDateKey(item.createdAt);
    const existing = map.get(key);
    if (existing) {
      existing.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // 최신 날짜 먼저
    .map(([dateKey, groupItems]) => ({
      dateKey,
      dateLabel: toLocalDateLabel(dateKey),
      count: groupItems.length,
      items: groupItems.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
}
