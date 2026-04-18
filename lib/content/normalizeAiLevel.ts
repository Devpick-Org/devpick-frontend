import type { AiSummaryLevel } from "@/types/content";
import type { QuizLevel } from "@/types/quiz";

const LEVELS = ["BEGINNER", "JUNIOR", "MIDDLE", "SENIOR"] as const;

/**
 * AI 요약·퀴즈 API/Dynamo에서 오는 level 문자열을 프론트 enum으로 맞춘다.
 * (예: mid → MIDDLE)
 */
export function normalizeAiLevel(raw: string): AiSummaryLevel {
  const u = raw.trim().toLowerCase();
  if (u === "mid") return "MIDDLE";
  const upper = raw.trim().toUpperCase();
  if ((LEVELS as readonly string[]).includes(upper)) {
    return upper as AiSummaryLevel;
  }
  return "JUNIOR";
}

export function normalizeQuizLevel(raw: string): QuizLevel {
  return normalizeAiLevel(raw) as QuizLevel;
}
