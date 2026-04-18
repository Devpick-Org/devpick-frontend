"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useAuthStore } from "@/store/auth.store";
import { OnboardingForm } from "@/components/features/onboarding/OnboardingForm";

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const mounted = useHydrated();

  const isOnboardingComplete = !!user?.job && !!user?.level && !!(user?.tags?.length);

  useEffect(() => {
    if (!mounted || !isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }

    if (isOnboardingComplete) {
      router.replace("/home");
    }
  }, [mounted, isInitialized, isAuthenticated, isOnboardingComplete, router]);

  if (!mounted || !isInitialized || !isAuthenticated || isOnboardingComplete) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <OnboardingForm />
    </div>
  );
}
