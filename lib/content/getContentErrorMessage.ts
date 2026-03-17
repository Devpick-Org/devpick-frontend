const CONTENT_ERROR_MESSAGES: Record<string, string> = {
  CONTENT_001: "콘텐츠를 찾을 수 없습니다.",
  CONTENT_002: "이미 스크랩한 콘텐츠입니다.",
  CONTENT_003: "스크랩하지 않은 콘텐츠입니다.",
  CONTENT_004: "이미 좋아요한 콘텐츠입니다.",
  CONTENT_005: "좋아요하지 않은 콘텐츠입니다.",
  CONTENT_006: "콘텐츠 소스를 찾을 수 없습니다.",
  AI_001: "AI 서버 오류가 발생했습니다.",
  AI_002: "AI 서버 응답 시간이 초과되었습니다.",
  AI_003: "AI 요약을 찾을 수 없습니다.",
};

export type AiSummaryErrorKind = "empty" | "timeout" | "error";

/**
 * 에러 코드를 AI 요약 UI 상태로 분류한다.
 * - AI_003 → empty  (아직 요약 없음)
 * - AI_002 → timeout (응답 시간 초과)
 * - 그 외  → error  (서버 오류 및 기타)
 */
export function getAiSummaryErrorKind(code?: string | null): AiSummaryErrorKind {
  if (code === "AI_003") return "empty";
  if (code === "AI_002") return "timeout";
  return "error";
}

/**
 * 에러 코드로 사용자에게 보여줄 메시지를 반환한다.
 * 코드에 매핑된 메시지가 없으면 fallback → 기본 메시지 순서로 사용한다.
 */
export function getContentErrorMessage(code?: string, fallback?: string): string {
  if (code && CONTENT_ERROR_MESSAGES[code]) {
    return CONTENT_ERROR_MESSAGES[code];
  }
  return fallback ?? "요청 처리 중 오류가 발생했습니다.";
}
