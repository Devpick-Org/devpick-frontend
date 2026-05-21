"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { subscriptionsEndpoints } from "@/lib/api/endpoints/subscriptions";

const PLAN_LABELS: Record<string, string> = {
  PRO: "Pro",
  MAX: "Max",
};

function SuccessLoadingUI() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        결제를 처리하고 있습니다...
      </p>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isInitialized, updateUser } = useAuthStore();
  const [planLabel, setPlanLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (hasProcessedRef.current) return;

    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }

    const authKey = searchParams.get("authKey");
    const customerKey = searchParams.get("customerKey");
    const planParam = searchParams.get("plan");

    if (
      !authKey ||
      !customerKey ||
      (planParam !== "PRO" && planParam !== "MAX")
    ) {
      router.replace("/plans");
      return;
    }

    const planType = planParam;
    hasProcessedRef.current = true;

    const processBilling = async () => {
      try {
        const result = await subscriptionsEndpoints.billingAuth({
          authKey,
          customerKey,
          planType,
        });
        updateUser({
          planType: result.data.planType,
          planExpiredAt: null,
        });
        setPlanLabel(PLAN_LABELS[planType]);
      } catch {
        setError("결제 처리 중 오류가 발생했습니다. 고객센터에 문의해 주세요.");
        hasProcessedRef.current = false;
      }
    };

    processBilling();
  }, [isInitialized, isAuthenticated, searchParams, updateUser, router]);

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => router.replace("/home")}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground cursor-pointer"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  if (!planLabel) {
    return <SuccessLoadingUI />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6">
      <CheckCircle className="h-14 w-14 text-primary" />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-semibold">
          {planLabel} 플랜이 시작됐습니다!
        </h1>
        <p className="text-sm text-muted-foreground">
          이제 {planLabel} 플랜의 모든 기능을 이용할 수 있어요.
        </p>
      </div>
      <button
        type="button"
        onClick={() => router.replace("/home")}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        홈으로 이동
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoadingUI />}>
      <SuccessContent />
    </Suspense>
  );
}
