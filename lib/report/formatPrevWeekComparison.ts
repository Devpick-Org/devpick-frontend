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

/**
 * prevWeekComparison은 전주 raw count이므로
 * 현재값 - 전주값으로 delta를 계산한다.
 */
export function formatPrevWeekComparison(
  current: { contentsRead: number; questionsCreated: number; jobPostingsViewed: number },
  prev: PrevWeekComparisonDeltas | null,
): PrevWeekFormatted {
  if (prev === null) {
    return { primary: "-", trend: "unknown" };
  }

  const deltaContents = current.contentsRead - prev.contentsRead;
  const deltaQuestions = current.questionsCreated - prev.questionsCreated;
  const deltaJobs = current.jobPostingsViewed - prev.jobPostingsViewed;

  const total = deltaContents + deltaQuestions + deltaJobs;

  if (deltaContents === 0 && deltaQuestions === 0 && deltaJobs === 0) {
    return { primary: "전주와 동일 (변화 없음)", trend: "flat" };
  }

  const trend: PrevWeekTrend = total > 0 ? "up" : total < 0 ? "down" : "flat";
  const primary = `글 ${signed(deltaContents)} · 질문 ${signed(deltaQuestions)} · 공고 ${signed(deltaJobs)}`;

  return { primary, trend };
}
