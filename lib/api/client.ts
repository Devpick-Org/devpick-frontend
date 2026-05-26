import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";
import type { RefreshTokenResponse } from "@/types/auth";

/** 배포/로컬 프론트 모두 기본적으로 운영 API를 사용. 필요 시 NEXT_PUBLIC_API_BASE_URL 로 덮어쓰기 */
const DEFAULT_API_URL = "https://traceapp.site";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_URL;

/**
 * 메인 API 클라이언트
 * - 요청 인터셉터: Zustand auth store에서 accessToken을 읽어 Authorization 헤더 자동 첨부
 * - 응답 인터셉터: 401 발생 시 /auth/refresh로 토큰 재발급 후 원래 요청 재시도
 *
 * 토큰 정책
 * - accessToken: Zustand 메모리에서 읽기 (localStorage/sessionStorage 사용 안 함)
 * - refreshToken: HttpOnly Cookie — 브라우저가 자동 첨부 (withCredentials: true)
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // HttpOnly Cookie(refreshToken) 자동 전송
});

/**
 * 토큰 갱신 전용 클라이언트 (인터셉터 없음 — 순환 참조 방지)
 */
export const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ─── Request Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: AxiosError | null, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error!);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

function handlePaymentError(code: string, detail: unknown): void {
  const { addToast, openPlanUpgradeModal, openLimitExceededModal } = useUiStore.getState();

  switch (code) {
    case "PAYMENT_001":
      addToast({ type: "error", message: "이미 구독 중입니다" });
      break;
    case "PAYMENT_002":
      if (typeof window !== "undefined") window.location.href = "/payment/fail";
      break;
    case "PAYMENT_003": {
      const d = detail as { requiredPlan?: "PRO" | "MAX" } | undefined;
      openPlanUpgradeModal(d?.requiredPlan ?? "PRO");
      break;
    }
    case "PAYMENT_004":
      addToast({ type: "error", message: "구독 정보를 찾을 수 없습니다" });
      break;
    case "PAYMENT_005": {
      const d = detail as { feature?: string; resetsAt?: string | null; requiredPlan?: "PRO" | "MAX" } | undefined;
      openLimitExceededModal({
        feature: d?.feature ?? "",
        resetsAt: d?.resetsAt ?? null,
        requiredPlan: d?.requiredPlan ?? "MAX",
      });
      break;
    }
    case "PAYMENT_006":
      addToast({ type: "error", message: "결제 취소 가능 기간(7일)이 지났습니다." });
      break;
    case "PAYMENT_007":
      addToast({ type: "error", message: "Free 기준치 초과 사용 이력이 있어 취소가 불가합니다." });
      break;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // PAYMENT 에러 처리 (401 리프레시보다 먼저)
    const errorCode = (error.response?.data as ApiErrorResponse | undefined)?.error?.code;
    if (typeof errorCode === "string" && errorCode.startsWith("PAYMENT_")) {
      handlePaymentError(errorCode, (error.response?.data as ApiErrorResponse | undefined)?.error?.detail);
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 비로그인 상태(accessToken 없음)에서 401이면 리프레시 시도하지 않음
    if (!useAuthStore.getState().accessToken) {
      return Promise.reject(error);
    }

    // 이미 토큰 갱신 중이면 큐에 추가하고 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // 요청 바디 없음 — 브라우저가 HttpOnly Cookie(refreshToken)를 자동 첨부
      const { data } = await refreshClient.post<ApiResponse<RefreshTokenResponse>>(
        "/auth/refresh",
      );
      const newAccessToken = data.data.accessToken;

      // accessToken만 메모리 상태에 업데이트 (refreshToken은 Cookie로 자동 갱신됨)
      useAuthStore.setState({ accessToken: newAccessToken });
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
