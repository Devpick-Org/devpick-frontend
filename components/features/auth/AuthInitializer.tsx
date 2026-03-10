"use client";

import { useEffect } from "react";
import { tokenManager } from "@/lib/auth/tokenManager";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/store/auth.store";

/**
 * 앱 초기 렌더 시 sessionStorage 토큰을 확인해 auth store를 복구합니다.
 * - 토큰 있음 → GET /users/me → initAuth(user)
 * - 토큰 없음 / 조회 실패 → clearAuth()
 */
export function AuthInitializer() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) return;

    authEndpoints
      .getMe()
      .then(({ data }) => {
        initAuth(data.data);
      })
      .catch(() => {
        clearAuth();
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
