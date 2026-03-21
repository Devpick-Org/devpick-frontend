import type {
  HistoryItem,
  HistoryActionType,
  ActivityItem,
  ActivityActionType,
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
 * createdAt에서 날짜 키 추출: "YYYY-MM-DDTHH:mm:ss" → "YYYY-MM-DD"
 *
 * [이유] 백엔드가 timezone 없는 서버 로컬 시간(KST)을 반환함.
 * new Date("2026-03-21T10:00:00")는 브라우저 환경에 따라 로컬/UTC 해석이 달라질 수 있으므로
 * Date 객체 생성 없이 문자열 슬라이싱으로 날짜 부분만 추출.
 * → 브라우저 timezone에 무관하게 서버 기준 날짜를 보존.
 */
function toLocalDateKey(dateStr: string): string {
  return dateStr.slice(0, 10); // "YYYY-MM-DD"
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
 * period 필터 — createdAt 날짜 부분 기준 문자열 비교 (제네릭: 학습/활동 공용)
 *
 * [이유] createdAt이 timezone 없는 서버 로컬 시간이므로
 * new Date(createdAt)의 getTime() 비교 대신 날짜 문자열 비교 사용.
 * cutoff는 브라우저 로컬 날짜(한국 사용자 = KST)로 계산하며,
 * 서버 로컬 시간(KST)과 동일 기준이므로 일관된 필터링이 가능함.
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
  // 브라우저 로컬 날짜를 "YYYY-MM-DD" 형식으로 변환
  const y = cutoff.getFullYear();
  const m = String(cutoff.getMonth() + 1).padStart(2, "0");
  const d = String(cutoff.getDate()).padStart(2, "0");
  const cutoffKey = `${y}-${m}-${d}`;
  return items.filter((item) => item.createdAt.slice(0, 10) >= cutoffKey);
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
