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
