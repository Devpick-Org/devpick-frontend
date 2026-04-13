import { create } from "zustand";
import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  /** AuthInitializer의 세션 복원 시도 완료 여부 */
  isInitialized: boolean;

  /** 로그인 성공 시 — 사용자 정보와 accessToken을 메모리에 저장 */
  setAuth: (user: User, accessToken: string) => void;
  /** 로그아웃 또는 토큰 만료 시 — 모든 인증 상태 초기화 */
  clearAuth: () => void;
  /** 앱 마운트 시 토큰 복원 후 인증 상태 복구 */
  initAuth: (user: User, accessToken: string) => void;
  updateUser: (data: Partial<User>) => void;
}

/**
 * 인증 전역 상태
 *
 * 토큰 저장 정책
 * - accessToken: 이 store의 메모리(Zustand)에만 저장 (XSS 방어)
 * - refreshToken: 백엔드가 HttpOnly Cookie로 관리 (프론트에서 직접 접근 불가)
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (user, accessToken) => {
    set({ user, accessToken, isAuthenticated: true });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
  },

  initAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true, isInitialized: true }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, ...data }
        : { userId: "", email: "", nickname: "", ...data },
      isAuthenticated: true,
    })),
}));
