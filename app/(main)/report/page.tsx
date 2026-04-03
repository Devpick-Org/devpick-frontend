"use client";

import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { LoginRequiredEmptyState } from "@/components/features/auth/LoginRequiredEmptyState";
import ReportTabsPage from "@/components/features/report/ReportTabsPage";

export default function Page() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();

  if (!mounted) return null;
  if (!isAuthenticated)
    return (
      <LoginRequiredEmptyState
        title="로그인이 필요합니다"
        description="주간 리포트는 로그인 후 이용할 수 있습니다."
      />
    );

  return <ReportTabsPage />;
}
