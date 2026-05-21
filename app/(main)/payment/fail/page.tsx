"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get("message") ?? "결제 중 오류가 발생했습니다.";
  const planParam = searchParams.get("plan");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6">
      <XCircle className="h-14 w-14 text-destructive" />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-semibold">결제에 실패했습니다</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.replace("/home")}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted cursor-pointer"
        >
          나중에
        </button>
        {planParam === "PRO" || planParam === "MAX" ? (
          <button
            type="button"
            onClick={() => router.replace(`/payment/billing?plan=${planParam}`)}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            다시 시도
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center" />
      }
    >
      <FailContent />
    </Suspense>
  );
}
