import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type { LoginRequest, SignupRequest, TokenResponse, User } from "@/types/auth";

export const authEndpoints = {
  /** POST /auth/signup — 이메일 회원가입 */
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<TokenResponse>>("/auth/signup", data),

  /** POST /auth/login — 이메일 로그인 */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<TokenResponse>>("/auth/login", data),

  /** POST /auth/logout — 로그아웃 */
  logout: () =>
    apiClient.post<ApiResponse<null>>("/auth/logout"),

  /** GET /users/me — 내 프로필 조회 */
  getMe: () =>
    apiClient.get<ApiResponse<User>>("/users/me"),
};
