import { create } from "zustand";
import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

/**
 * 인증 전역 상태
 *
 * 보안 전략:
 * - accessToken: 메모리(Zustand)에만 저장 — localStorage/sessionStorage 사용 금지
 * - refreshToken: 서버가 HttpOnly Cookie로 관리 (클라이언트 접근 불가)
 * - 페이지 새로고침 시 refreshToken 쿠키로 accessToken 자동 재발급 (POST /auth/refresh)
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set({ user, accessToken: token, isAuthenticated: true }),

  setToken: (token) => set({ accessToken: token }),

  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
