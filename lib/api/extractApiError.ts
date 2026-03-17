export interface ApiErrorShape {
  code?: string;
  message?: string;
  /** 소셜 탈퇴 계정 복구 시 error.detail.recoveryToken 에서 추출 */
  recoveryToken?: string;
}

export function extractApiError(error: unknown): ApiErrorShape {
  const axiosError = error as {
    response?: {
      data?: {
        error?: {
          code?: string;
          message?: string;
          detail?: { recoveryToken?: string };
        };
      };
    };
  };
  const err = axiosError.response?.data?.error;
  return {
    code: err?.code,
    message: err?.message,
    recoveryToken: err?.detail?.recoveryToken,
  };
}
