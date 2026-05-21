"use client";

import { useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui.store";

export function PlanUpgradeModal() {
  const router = useRouter();
  const { planUpgradeModal, closePlanUpgradeModal } = useUiStore();
  const titleId = useId();

  useEffect(() => {
    if (!planUpgradeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePlanUpgradeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [planUpgradeModal, closePlanUpgradeModal]);

  if (!planUpgradeModal) return null;

  const { requiredPlan } = planUpgradeModal;
  const isPro = requiredPlan === "PRO";

  const handleUpgrade = () => {
    closePlanUpgradeModal();
    router.push(`/payment/billing?plan=${requiredPlan}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
      onClick={closePlanUpgradeModal}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-sm",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-xl bg-card p-6 shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {isPro ? "Pro 이상 플랜 전용 기능" : "Max 플랜 전용 기능"}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isPro
              ? "이 기능은 Pro 이상 플랜에서 사용할 수 있어요."
              : "이 기능은 Max 플랜에서만 사용할 수 있어요."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            onClick={closePlanUpgradeModal}
            className="border-0 bg-secondary text-foreground hover:!bg-secondary hover:text-foreground"
          >
            닫기
          </Button>
          <Button onClick={handleUpgrade}>
            {isPro ? "Pro 시작하기" : "Max 시작하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
