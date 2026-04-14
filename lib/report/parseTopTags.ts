/**
 * GET /reports/weekly 의 topTags — 백엔드는 JSON 배열 문자열
 * (예: [{"tag":"Java","count":3},...]) 또는 레거시 쉼표 구분 문자열.
 */
export function parseReportTopTags(raw: string | null | undefined): string[] {
  if (raw == null || raw === "") return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed) as unknown;
      if (!Array.isArray(arr)) return [];
      return arr
        .map((item) => {
          if (item && typeof item === "object") {
            const o = item as Record<string, unknown>;
            if (typeof o.tag === "string") return o.tag;
            if (typeof o.tagName === "string") return o.tagName;
          }
          return "";
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  }
  return trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
