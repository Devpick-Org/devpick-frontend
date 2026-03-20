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
 * "2026-03-14" → "2026년 3월 3주차"
 * 월요일 기준 주차 계산 (ISO 방식과 유사)
 * 월의 첫날 요일 offset을 보정해 해당 날짜가 몇 번째 월~일 구간에 속하는지 반환
 */
export function formatWeekLabel(weekStart: string): string {
  const date = new Date(weekStart + "T00:00:00");
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const firstDayOfMonth = new Date(year, date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // 월요일 기준 offset: Mon=0, Tue=1, ..., Sun=6
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const week = Math.ceil((date.getDate() + offset) / 7);

  return `${year}년 ${month}월 ${week}주차`;
}
