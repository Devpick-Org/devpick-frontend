"use client";

import { useEffect } from "react";
import { refreshClient } from "@/lib/api/client";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/store/auth.store";
import type { ApiResponse } from "@/types/api";
import type { RefreshTokenResponse } from "@/types/auth";

/**
 * 앱 초기 렌더 시 세션 복원을 시도합니다.
 *
 * accessToken은 메모리(Zustand)에만 저장되므로 페이지 새로고침 시 초기화됩니다.
 * HttpOnly Cookie의 refreshToken으로 POST /auth/refresh를 시도해 새 accessToken을 발급받고,
 * 성공하면 GET /users/me로 사용자 정보를 조회해 인증 상태를 복원합니다.
 */
export function AuthInitializer() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    async function restoreSession() {
      try {
        // withCredentials: true 로 HttpOnly Cookie(refreshToken)를 자동 첨부
        const { data: refreshData } = await refreshClient.post<ApiResponse<RefreshTokenResponse>>(
          "/auth/refresh",
        );
        const newAccessToken = refreshData.data.accessToken;

        // accessToken 먼저 메모리에 세팅해야 /users/me 요청에 Authorization 헤더가 붙음
        useAuthStore.setState({ accessToken: newAccessToken });

        const { data: meData } = await authEndpoints.getMe();
        initAuth(meData.data, newAccessToken);
      } catch {
        // 쿠키 없음 or 만료 — 로그인 필요 상태 유지
        clearAuth();
      }
    }

    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
