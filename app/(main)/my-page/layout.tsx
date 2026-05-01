"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/lib/hooks/useHydrated";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const mounted = useHydrated();
  const router = useRouter();
  const pathname = usePathname();

  const isSubPage = pathname !== "/my-page";

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated && isSubPage) {
      router.replace("/my-page");
    }
  }, [mounted, isInitialized, isAuthenticated, isSubPage, router]);

  if (!mounted || !isInitialized) return null;

  // 하위 페이지는 미인증 시 리다이렉트 대기 중 아무것도 표시 안 함
  if (!isAuthenticated && isSubPage) return null;

  return <>{children}</>;
}
