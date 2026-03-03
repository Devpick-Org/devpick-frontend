import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";
import type { TokenResponse } from "@/types/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.devpick.kr/v1";

/**
 * 메인 API 클라이언트
 * - 요청 인터셉터: Zustand auth store에서 accessToken을 읽어 Authorization 헤더 자동 첨부
 * - 응답 인터셉터: 401 발생 시 /auth/refresh로 토큰 재발급 후 원래 요청 재시도
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // HttpOnly Cookie(refreshToken) 전송
});

/**
 * 토큰 갱신 전용 클라이언트 (인터셉터 없음 — 순환 참조 방지)
 */
const refreshClient = axios.create({
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
  (error: AxiosError) => Promise.reject(error)
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
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
      const { data } = await refreshClient.post<ApiResponse<TokenResponse>>(
        "/auth/refresh"
      );
      const newToken = data.data.accessToken;

      useAuthStore.getState().setToken(newToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
