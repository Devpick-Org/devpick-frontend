"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

function BillingLoadingUI() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">결제 준비 중...</p>
    </div>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);

  const planParam = searchParams.get("plan");

  useEffect(() => {
    if (!isInitialized) return;
    if (hasStartedRef.current) return;

    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }

    if (planParam !== "PRO" && planParam !== "MAX") {
      router.replace("/plans");
      return;
    }

    const planType = planParam;
    hasStartedRef.current = true;

    const startBilling = async () => {
      try {
        const tossPayments = await loadTossPayments(
          process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!,
        );
        const customerKey = crypto.randomUUID();
        const payment = tossPayments.payment({ customerKey });

        await payment.requestBillingAuth({
          method: "CARD",
          successUrl: `${window.location.origin}/payment/success?plan=${planType}`,
          failUrl: `${window.location.origin}/payment/fail?plan=${planType}`,
          customerEmail: user!.email,
          customerName: user!.nickname,
        });
      } catch (err) {
        if ((err as Error).message === '취소되었습니다.') {
          router.replace('/plans');
          return;
        }
        setError("결제 준비 중 오류가 발생했습니다. 다시 시도해 주세요.");
        hasStartedRef.current = false;
      }
    };

    startBilling();
  }, [isInitialized, isAuthenticated, planParam, user, router]);

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return <BillingLoadingUI />;
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingLoadingUI />}>
      <BillingContent />
    </Suspense>
  );
}
