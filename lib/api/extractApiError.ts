export interface ApiErrorShape {
  code?: string;
  message?: string;
}

export function extractApiError(error: unknown): ApiErrorShape {
  const axiosError = error as {
    response?: { data?: { error?: { code?: string; message?: string } } };
  };
  return {
    code: axiosError.response?.data?.error?.code,
    message: axiosError.response?.data?.error?.message,
  };
}
