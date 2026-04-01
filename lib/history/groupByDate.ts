import type {
  HistoryItem,
  HistoryActionType,
  ActivityItem,
  ActivityActionType,
  ActivityFilterValue,
} from "@/types/history";

export type PeriodFilter = "7d" | "30d" | "all";

/** 날짜별 그룹 — T 기본값 HistoryItem (기존 코드 호환) */
export interface DateGroup<T = HistoryItem> {
  dateKey: string; // "2026-03-21" — 정렬/식별 키
  dateLabel: string; // "2026년 3월 21일" — 화면 표시
  count: number;
  items: T[];
}

/**
 * createdAt에서 KST(Asia/Seoul) 기준 날짜 키 추출: "YYYY-MM-DDTHH:mm:ssZ" → "YYYY-MM-DD"
 *
 * [이유] 백엔드가 ISO 8601 UTC(Z) 형식으로 반환하므로 단순 슬라이싱 시
 * KST 자정(UTC 15:00) 전후 아이템이 하루 밀리는 버그가 발생한다.
 * Intl.DateTimeFormat으로 Asia/Seoul 기준 날짜를 추출해 timezone에 무관하게 정확히 동작한다.
 */
function toLocalDateKey(dateStr: string): string {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(dateStr));

  const y = parts.find((p) => p.type === "year")?.value ?? "";
  const m = parts.find((p) => p.type === "month")?.value ?? "";
  const d = parts.find((p) => p.type === "day")?.value ?? "";

  return `${y}-${m}-${d}`; // "YYYY-MM-DD"
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

/**
 * period 필터 — KST 기준 날짜 문자열 비교 (제네릭: 학습/활동 공용)
 *
 * [이유] createdAt이 UTC(Z) 형식이므로 toLocalDateKey로 KST 날짜를 추출해 비교한다.
 * cutoff도 브라우저 로컬 날짜(KST)로 계산하므로 동일 기준으로 일관된 필터링이 가능하다.
 */
export function filterByPeriod<T extends { createdAt: string }>(
  items: T[],
  period: PeriodFilter,
): T[] {
  if (period === "all") return items;
  const days = period === "7d" ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  // 브라우저 로컬 날짜(KST)를 "YYYY-MM-DD" 형식으로 변환
  const y = cutoff.getFullYear();
  const m = String(cutoff.getMonth() + 1).padStart(2, "0");
  const d = String(cutoff.getDate()).padStart(2, "0");
  const cutoffKey = `${y}-${m}-${d}`;
  return items.filter((item) => toLocalDateKey(item.createdAt) >= cutoffKey);
}

/** actionType 필터 — 학습 탭 전용 */
export function filterByActions(
  items: HistoryItem[],
  selectedActions: HistoryActionType[],
): HistoryItem[] {
  if (selectedActions.length === 0) return items;
  return items.filter((item) => selectedActions.includes(item.actionType));
}

/**
 * actionType 필터 — 활동 탭 전용
 * "answer" 가상 필터 값은 answer_written + answer_adopted로 확장됨
 */
export function filterByActivityActions(
  items: ActivityItem[],
  selectedActions: ActivityFilterValue[],
): ActivityItem[] {
  if (selectedActions.length === 0) return items;

  const expanded: ActivityActionType[] = selectedActions.flatMap((v) =>
    v === "answer" ? (["answer_written", "answer_adopted"] as ActivityActionType[]) : [v as ActivityActionType],
  );

  return items.filter((item) => expanded.includes(item.actionType));
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
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
}

/** createdAt 기준 날짜별 그룹핑 — 학습 탭 */
export function groupByDate(items: HistoryItem[]): DateGroup[] {
  return groupItemsByLocalDate(items);
}

/** createdAt 기준 날짜별 그룹핑 — 활동 탭 */
export function groupByActivityDate(
  items: ActivityItem[],
): DateGroup<ActivityItem>[] {
  return groupItemsByLocalDate(items);
}
