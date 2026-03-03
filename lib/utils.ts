/**
 * 클래스명을 조합하는 유틸리티 함수
 * TODO: tailwind-merge, clsx 설치 후 cn() 고도화 가능
 */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 날짜를 한국어 포맷으로 변환
 * @example formatDate("2026-03-03T00:00:00Z") → "2026. 3. 3."
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR");
}

/**
 * 상대적 시간 표현
 * @example formatRelativeTime("2026-03-02T00:00:00Z") → "1일 전"
 */
export function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
}
