import type { PrevWeekComparisonDeltas } from "@/types/report";

/** GET /reports/weekly 의 전주 비교 — 백엔드가 객체 또는 JSON 문자열로 내릴 수 있음 */

export type PrevWeekTrend = "up" | "down" | "flat" | "unknown";

export interface PrevWeekFormatted {
  primary: string;
  trend: PrevWeekTrend;
}

function coerceNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function deltasFromUnknown(obj: Record<string, unknown>): PrevWeekComparisonDeltas | null {
  if (!("contentsRead" in obj) && !("questionsCreated" in obj) && !("scrapsCount" in obj)) {
    return null;
  }
  return {
    contentsRead: coerceNumber(obj.contentsRead),
    questionsCreated: coerceNumber(obj.questionsCreated),
    scrapsCount: coerceNumber(obj.scrapsCount),
  };
}

/** API 값(문자열·객체)을 증감 객체로 해석한다. 실패하면 null. */
export function parsePrevWeekDeltas(raw: unknown): PrevWeekComparisonDeltas | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "object") {
    return deltasFromUnknown(raw as Record<string, unknown>);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (parsed && typeof parsed === "object") {
          return deltasFromUnknown(parsed as Record<string, unknown>);
        }
      } catch {
        return null;
      }
    }
  }
  return null;
}

function signed(n: number): string {
  if (n === 0) return "0";
  return n > 0 ? `+${n}` : `${n}`;
}

function sumDeltas(d: PrevWeekComparisonDeltas): number {
  return d.contentsRead + d.questionsCreated + d.scrapsCount;
}

/** 레거시: "+12%" 같은 문자열 요약만 내려오는 경우 */
function parseLegacyTrend(text: string): PrevWeekTrend {
  if (text.startsWith("+")) return "up";
  if (text.startsWith("-")) return "down";
  return "unknown";
}

/** 카드 표시용 한국어 문자열 및 증감 톤 */
export function formatPrevWeekComparison(raw: unknown): PrevWeekFormatted {
  const deltas = parsePrevWeekDeltas(raw);

  if (deltas !== null) {
    const flat =
      deltas.contentsRead === 0 &&
      deltas.questionsCreated === 0 &&
      deltas.scrapsCount === 0;
    const total = sumDeltas(deltas);

    let trend: PrevWeekTrend;
    if (flat) trend = "flat";
    else if (total > 0) trend = "up";
    else if (total < 0) trend = "down";
    else trend = "flat";

    if (flat) {
      return { primary: "전주와 동일 (변화 없음)", trend };
    }

    const primary =
      `글 ${signed(deltas.contentsRead)} · 질문 ${signed(deltas.questionsCreated)} · 스크랩 ${signed(deltas.scrapsCount)}`;
    return { primary, trend };
  }

  if (typeof raw === "string") {
    const t = raw.trim();
    if (t === "") {
      return { primary: "-", trend: "unknown" };
    }
    if (t.startsWith("{")) {
      return { primary: "-", trend: "unknown" };
    }
    return {
      primary: t,
      trend: parseLegacyTrend(t),
    };
  }

  return { primary: "-", trend: "unknown" };
}
