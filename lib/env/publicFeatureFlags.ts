/**
 * NEXT_PUBLIC_* 값이 배포/호스트마다 `true` / `1` / `True` 등으로 달라질 수 있어
 * 엄격한 `=== "true"` 비교는 플래그가 꺼진 것처럼 보이는 원인이 됩니다.
 */
export function isPublicFeatureEnabled(value: string | undefined): boolean {
  if (value == null) return false;
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

export function isTrendsFeatureEnabled(): boolean {
  return isPublicFeatureEnabled(process.env.NEXT_PUBLIC_FEATURE_TRENDS);
}
