"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useAuthStore } from "@/store/auth.store";
import { ResumePage } from "@/components/features/resume/ResumePage";

function ResumePageInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const defaultTab =
    tab === "qa" ? "qa" : tab === "mock" ? "mock" : "resume";

  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl pb-12">
        <div className="mb-6 rounded-3xl border border-border bg-card px-5 py-5 shadow-sm sm:px-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Resume Hub
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-foreground md:text-3xl">
            이력서 관리
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
            이력서를 업로드하거나 직접 편집하면 공고 매칭, 면접 Q&A, 부족 역량
            추천에 바로 반영됩니다.
          </p>
        </div>
        <ResumePage defaultTab={defaultTab} />
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const mounted = useHydrated();

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      router.replace("/jobs");
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  if (!mounted || !isInitialized || !isAuthenticated) return null;

  return (
    <Suspense>
      <ResumePageInner />
    </Suspense>
  );
}
