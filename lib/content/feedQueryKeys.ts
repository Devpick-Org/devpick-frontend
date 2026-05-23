/** 홈·추천 피드 React Query 키 — 직무·태그 변경 시 목록이 다시 불러와지도록 합니다. */
export function contentFeedQueryKey(params: {
  searchQuery?: string;
  isAuthenticated: boolean;
  job?: string | null;
  tags?: string[] | null;
}) {
  const tagKey = [...(params.tags ?? [])].sort().join("|");
  const trimmed = params.searchQuery?.trim();
  if (trimmed) {
    return ["contents", "search", trimmed, params.isAuthenticated] as const;
  }
  return ["contents", params.isAuthenticated, params.job ?? "", tagKey] as const;
}
