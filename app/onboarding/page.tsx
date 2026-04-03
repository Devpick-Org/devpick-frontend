"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useAuthStore } from "@/store/auth.store";
import { OnboardingForm } from "@/components/features/onboarding/OnboardingForm";

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <OnboardingForm />
    </div>
  );
}
