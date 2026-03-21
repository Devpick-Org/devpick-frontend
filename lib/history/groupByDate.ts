import type { HistoryItem, HistoryActionType, ActivityItem, ActivityActionType } from "@/types/history";

export type PeriodFilter = "7d" | "30d" | "all";

/** 날짜별 그룹 — T 기본값 HistoryItem (기존 코드 호환) */
export interface DateGroup<T = HistoryItem> {
  dateKey: string;   // "2026-03-21" — 정렬/식별 키
  dateLabel: string; // "2026년 3월 21일" — 화면 표시
  count: number;
  items: T[];
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
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** period 필터 — createdAt 로컬 날짜 기준 (제네릭: 학습/활동 공용) */
export function filterByPeriod<T extends { createdAt: string }>(
  items: T[],
  period: PeriodFilter,
): T[] {
  if (period === "all") return items;
  const days = period === "7d" ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return items.filter((item) => new Date(item.createdAt) >= cutoff);
}

/** actionType 필터 — 학습 탭 전용 */
export function filterByActions(
  items: HistoryItem[],
  selectedActions: HistoryActionType[],
): HistoryItem[] {
  if (selectedActions.length === 0) return items;
  return items.filter((item) => selectedActions.includes(item.actionType));
}

/** actionType 필터 — 활동 탭 전용 */
export function filterByActivityActions(
  items: ActivityItem[],
  selectedActions: ActivityActionType[],
): ActivityItem[] {
  if (selectedActions.length === 0) return items;
  return items.filter((item) => selectedActions.includes(item.actionType));
}

/** 날짜별 그룹핑 공통 로직 (날짜: 최신순 / 그룹 내 아이템: 최신순) */
function groupItemsByLocalDate<T extends { createdAt: string }>(
  items: T[],
): DateGroup<T>[] {
  const map = new Map<string, T[]>();

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
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupItems]) => ({
      dateKey,
      dateLabel: toLocalDateLabel(dateKey),
      count: groupItems.length,
      items: groupItems.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
}

/** createdAt 기준 날짜별 그룹핑 — 학습 탭 */
export function groupByDate(items: HistoryItem[]): DateGroup[] {
  return groupItemsByLocalDate(items);
}

/** createdAt 기준 날짜별 그룹핑 — 활동 탭 */
export function groupByActivityDate(items: ActivityItem[]): DateGroup<ActivityItem>[] {
  return groupItemsByLocalDate(items);
}
