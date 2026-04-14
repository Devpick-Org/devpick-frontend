import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dedupeTags(tags: string[] | undefined): string[] {
  if (!tags) return [];
  return [...new Set(tags)];
}

export function copyShareLink(url: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
  }
  toast.success("링크가 복사되었습니다.");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * "2026-03-21T10:30:00" → "2026년 3월 21일 오전 10:30"
 *
 * [주의] 히스토리 createdAt은 timezone 없는 서버 로컬 시간(KST).
 * ECMAScript에서 timezone 없는 datetime 문자열은 로컬 시간으로 파싱되므로
 * 한국(KST) 사용자 환경에서 올바르게 동작함.
 */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * "2026-03-21T10:30:00" → "오전 10:30"
 *
 * [주의] 히스토리 createdAt은 timezone 없는 서버 로컬 시간(KST).
 * timezone 없는 datetime 문자열은 브라우저 로컬 시간으로 파싱됨.
 */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * "2026-03-14" → "2026년 3월 3주차"
 * 월요일 기준 주차 계산 (ISO 방식과 유사)
 * 월의 첫날 요일 offset을 보정해 해당 날짜가 몇 번째 월~일 구간에 속하는지 반환
 *
 * API는 `2026-04-13`(날짜만) 또는 `2026-04-13T00:00:00Z`(Instant) 둘 다 줄 수 있음.
 * 후자에 `T00:00:00`를 또 붙이면 Invalid Date → NaN 주차가 되므로 분기함.
 */
export function formatWeekLabel(weekStart: string): string {
  const date = weekStart.includes("T")
    ? new Date(weekStart)
    : new Date(`${weekStart}T00:00:00`);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const firstDayOfMonth = new Date(year, date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // 월요일 기준 offset: Mon=0, Tue=1, ..., Sun=6
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const week = Math.ceil((date.getDate() + offset) / 7);

  return `${year}년 ${month}월 ${week}주차`;
}
