import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  SocialAuthResponse,
  OAuthStartResponse,
  User,
} from "@/types/auth";

export const authEndpoints = {
  /** POST /auth/signup — 이메일 회원가입 */
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/signup", data),

  /** POST /auth/login — 이메일 로그인 */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data),

  /** GET /auth/github — GitHub OAuth 시작 URL 발급 */
  getGithubOAuthUrl: () =>
    apiClient.get<ApiResponse<OAuthStartResponse>>("/auth/github"),

  /** GET /auth/google — Google OAuth 시작 URL 발급 */
  getGoogleOAuthUrl: () =>
    apiClient.get<ApiResponse<OAuthStartResponse>>("/auth/google"),

  /** GET /auth/github/callback — GitHub 소셜 로그인 콜백 */
  githubCallback: (code: string, state: string) =>
    apiClient.get<ApiResponse<SocialAuthResponse>>("/auth/github/callback", {
      params: { code, state },
    }),

  /** GET /auth/google/callback — Google 소셜 로그인 콜백 */
  googleCallback: (code: string, state: string) =>
    apiClient.get<ApiResponse<SocialAuthResponse>>("/auth/google/callback", {
      params: { code, state },
    }),

  /** POST /auth/logout — 로그아웃 */
  logout: () => apiClient.post<ApiResponse<null>>("/auth/logout"),

  /** GET /users/me — 내 프로필 조회 */
  getMe: () => apiClient.get<ApiResponse<User>>("/users/me"),

  /** DELETE /users/me — 회원 탈퇴 */
  deleteMe: () => apiClient.delete<ApiResponse<null>>("/users/me"),

  /** POST /auth/email/send — 이메일 인증 코드 발송 */
  sendEmailCode: (email: string) =>
    apiClient.post<ApiResponse<null>>("/auth/email/send", { email }),

  /** POST /auth/email/verify — 인증 코드 검증 */
  verifyEmailCode: (email: string, code: string) =>
    apiClient.post<ApiResponse<null>>("/auth/email/verify", { email, code }),
};
