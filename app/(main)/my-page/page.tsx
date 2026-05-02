"use client";

import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { LoginRequiredEmptyState } from "@/components/features/auth/LoginRequiredEmptyState";
import MyPage from "@/components/features/my-page/MyPage";

export default function Page() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const mounted = useHydrated();

  if (!mounted || !isInitialized) return null;
  if (!isAuthenticated)
    return (
      <LoginRequiredEmptyState
        title="로그인이 필요합니다"
        description="마이페이지는 로그인 후 이용할 수 있습니다."
      />
    );

  return <MyPage />;
}
