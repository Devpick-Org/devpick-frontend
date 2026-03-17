export { extractApiError, type ApiErrorShape } from "@/lib/api/extractApiError";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AUTH_004: "이미 사용 중인 이메일입니다.",
  AUTH_005: "사용자를 찾을 수 없습니다.",
  AUTH_006: "비밀번호가 일치하지 않습니다.",
  AUTH_007: "이미 사용 중인 닉네임입니다.",
  AUTH_008: "인증 코드는 1분에 1회만 요청할 수 있습니다.",
  AUTH_009: "인증 코드가 만료되었습니다. 재발송해 주세요.",
  AUTH_010: "인증 코드가 올바르지 않습니다.",
  AUTH_011: "인증 시도 횟수를 초과했습니다. 코드를 재발송해 주세요.",
  AUTH_012: "이메일 인증이 완료되지 않았습니다.",
  AUTH_014: "GitHub 계정의 이메일을 가져올 수 없습니다. GitHub 계정에서 이메일 공개 설정을 확인해 주세요.",
  AUTH_016: "Google 계정의 이메일을 가져올 수 없습니다.",
  AUTH_017: "유효하지 않은 인증 요청입니다. 다시 로그인해 주세요.",
  AUTH_018: "인증 코드가 만료되었습니다. 소셜 로그인을 다시 시도해 주세요.",
  AUTH_019: "소셜 로그인 접근이 거부되었습니다.",
  AUTH_020: "OAuth 설정 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  AUTH_021: "필요한 권한이 거부되었습니다.",
  AUTH_023: "이메일 인증을 먼저 완료해 주세요.",
  AUTH_024: "탈퇴 처리 중인 계정입니다. 7일 이내 복구할 수 있습니다.",
  AUTH_025: "탈퇴 처리가 완료된 계정입니다.",
  COMMON_005: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

/**
 * 에러 코드로 사용자에게 보여줄 메시지를 반환한다.
 * 코드에 매핑된 메시지가 없으면 fallback → 기본 메시지 순서로 사용한다.
 */
export function getAuthErrorMessage(code?: string, fallback?: string): string {
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return fallback ?? "요청 처리 중 오류가 발생했습니다.";
}
