import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
} from "@/types/auth";

export const authEndpoints = {
  /** POST /auth/signup — 이메일 회원가입 */
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/signup", data),

  /** POST /auth/login — 이메일 로그인 */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data),

  /** GET /auth/google/callback — Google 소셜 로그인 콜백 */
  googleSocialLogin: (code: string) =>
    apiClient.get<ApiResponse<AuthResponse>>("/auth/google/callback", {
      params: { code },
    }),

  /** GET /auth/github/callback — GitHub 소셜 로그인 콜백 */
  githubSocialLogin: (code: string) =>
    apiClient.get<ApiResponse<AuthResponse>>("/auth/github/callback", {
      params: { code },
    }),

  /** POST /auth/logout — 로그아웃 */
  logout: () => apiClient.post<ApiResponse<null>>("/auth/logout"),

  /** GET /users/me — 내 프로필 조회 */
  getMe: () => apiClient.get<ApiResponse<User>>("/users/me"),

  /** POST /auth/email/send — 이메일 인증 코드 발송 */
  sendEmailCode: (email: string) =>
    apiClient.post<ApiResponse<null>>("/auth/email/send", { email }),

  /** POST /auth/email/verify — 인증 코드 검증 */
  verifyEmailCode: (email: string, code: string) =>
    apiClient.post<ApiResponse<null>>("/auth/email/verify", { email, code }),
};

/** Mock: setTimeout 기반 시뮬레이션 (백엔드 연동 전 사용) */
export const mockAuthEndpoints = {
  sendEmailCode: (_email: string): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }),

  /** 인증번호 "123456"만 성공 */
  verifyEmailCode: (_email: string, code: string): Promise<void> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code === "123456") {
          resolve();
        } else {
          reject(new Error("CODE_MISMATCH"));
        }
      }, 800);
    }),

  signup: (_data: SignupRequest): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(resolve, 800);
    }),

  login: (email: string, password: string): Promise<void> =>
    new Promise((resolve, reject) => {
      // console.log("[Mock API] 로그인 요청 데이터:", { email, password });
      setTimeout(() => {
        if (email === "test@example.com" && password === "Test1234!") {
          resolve();
        } else {
          reject(new Error("이메일 또는 비밀번호가 일치하지 않습니다."));
        }
      }, 800);
    }),
};
