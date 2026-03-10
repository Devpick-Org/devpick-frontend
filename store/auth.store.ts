import { create } from "zustand";
import type { User } from "@/types/auth";
import { tokenManager } from "@/lib/auth/tokenManager";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  initAuth: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
}

/**
 * 인증 전역 상태
 *
 * 역할
 * - 현재 로그인된 사용자 정보 관리
 * - 로그인 여부 상태 관리
 *
 * 토큰 저장 전략
 * - accessToken / refreshToken 저장은 tokenManager가 담당
 * - 현재는 SessionStorageStrategy 사용
 * - 추후 HttpOnly Cookie 전략으로 교체 가능
 *
 * 구조
 * auth.store
 *    ↓
 * tokenManager
 *    ↓
 * TokenStrategy (SessionStorage / Cookie)
 */

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user, accessToken, refreshToken) => {
    tokenManager.setTokens(accessToken, refreshToken);
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    tokenManager.clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  initAuth: (user) => set({ user, isAuthenticated: true }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, ...data }
        : { userId: "", email: "", nickname: "", ...data },
      isAuthenticated: true,
    })),
}));
