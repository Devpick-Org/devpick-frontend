/** 홈 상세 등에서 인라인 원문을 숨길 소스 (외부 canonical 링크만 유지). */

export function isVelogSource(sourceName: string): boolean {
  return sourceName.trim().toLowerCase() === "velog";
}

export function isStackOverflowSource(sourceName: string): boolean {
  return sourceName.trim().toLowerCase() === "stack overflow";
}

export function hideInlineOriginalSource(sourceName: string): boolean {
  return isVelogSource(sourceName) || isStackOverflowSource(sourceName);
}
