import type { PrevWeekComparisonDeltas } from "@/types/report";

export type PrevWeekTrend = "up" | "down" | "flat" | "unknown";

export interface PrevWeekFormatted {
  primary: string;
  trend: PrevWeekTrend;
}

function signed(n: number): string {
  if (n === 0) return "0";
  return n > 0 ? `+${n}` : `${n}`;
}

function coerceNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

/** JSON 문자열 또는 객체에서 prevWeek 수치를 파싱한다. */
export function parsePrevWeekComparisonRaw(
  raw: unknown,
): PrevWeekComparisonDeltas | null {
  if (raw == null) return null;

  let obj: Record<string, unknown> | null = null;

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed || !trimmed.startsWith("{")) return null;
    try {
      obj = JSON.parse(trimmed) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (typeof raw === "object") {
    obj = raw as Record<string, unknown>;
  }

  if (!obj) return null;

  return {
    contentsRead: coerceNumber(obj.contentsRead),
    questionsCreated: coerceNumber(obj.questionsCreated),
    // 백엔드가 아직 scrapsCount로 내려줄 수 있음 — jobPostingsViewed 없으면 0
    jobPostingsViewed: coerceNumber(obj.jobPostingsViewed ?? 0),
  };
}

/**
 * prevWeekComparison은 전주 raw count이므로 현재값 - 전주값으로 delta를 계산한다.
 */
export function formatPrevWeekComparison(
  current: { contentsRead: number; questionsCreated: number; jobPostingsViewed: number },
  raw: unknown,
): PrevWeekFormatted {
  const prev = parsePrevWeekComparisonRaw(raw);

  if (prev === null) {
    return { primary: "-", trend: "unknown" };
  }

  const deltaContents = current.contentsRead - prev.contentsRead;
  const deltaQuestions = current.questionsCreated - prev.questionsCreated;
  const deltaJobs = current.jobPostingsViewed - prev.jobPostingsViewed;

  if (deltaContents === 0 && deltaQuestions === 0 && deltaJobs === 0) {
    return { primary: "전주와 동일 (변화 없음)", trend: "flat" };
  }

  const total = deltaContents + deltaQuestions + deltaJobs;
  const trend: PrevWeekTrend = total > 0 ? "up" : total < 0 ? "down" : "flat";

  /** 한 줄의 `글 -1 · 질문 …` 같은 표기는 줄바꿈에 어색해져 카드 레이블과 맞춰 세 줄로 둔다. */
  const primary = [
    `읽은 글 ${signed(deltaContents)}개`,
    `질문 ${signed(deltaQuestions)}개`,
    `확인 공고 ${signed(deltaJobs)}개`,
  ].join("\n");

  return { primary, trend };
}
