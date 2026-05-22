"use client";

import { useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui.store";

const FEATURE_LABELS: Record<string, string> = {
  aiRefineDaily: "AI 질문 개선",
  aiAnswerDaily: "AI 답변",
  skillBoostWeekly: "부족 역량 보완",
  interviewQaGenerateWeekly: "면접 Q&A 생성",
  mockInterviewWeekly: "모의 면접",
};

function formatResetsAt(resetsAt: string | null): string {
  if (!resetsAt) return "";

  const now = new Date();
  const resets = new Date(resetsAt);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const resetsDay = new Date(
    resets.getFullYear(),
    resets.getMonth(),
    resets.getDate(),
  );
  const diffDays = Math.round(
    (resetsDay.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "오늘 자정";
  if (diffDays === 1) return "내일 자정";
  if (diffDays <= 7 && resets.getDay() === 1) return "다음 주 월요일";
  return `${resets.getMonth() + 1}월 ${resets.getDate()}일`;
}

export function LimitExceededModal() {
  const router = useRouter();
  const { limitExceededModal, closeLimitExceededModal } = useUiStore();
  const titleId = useId();

  useEffect(() => {
    if (!limitExceededModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLimitExceededModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [limitExceededModal, closeLimitExceededModal]);

  if (!limitExceededModal) return null;

  const { feature, resetsAt, requiredPlan } = limitExceededModal;
  const featureLabel = FEATURE_LABELS[feature] ?? feature;
  const resetsLabel = formatResetsAt(resetsAt);

  const handleUpgrade = () => {
    closeLimitExceededModal();
    router.push(`/payment/billing?plan=${requiredPlan}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
      onClick={closeLimitExceededModal}
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {featureLabel} 한도 초과
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            이번 기간 사용 한도를 모두 소진했어요.
            {resetsLabel && (
              <>
                <br />
                <span className="font-medium text-foreground">{resetsLabel}</span>에 초기화됩니다.
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            onClick={closeLimitExceededModal}
            className="border-0 bg-secondary text-foreground hover:!bg-secondary hover:text-foreground"
          >
            닫기
          </Button>
          <Button onClick={handleUpgrade}>
            {requiredPlan === "PRO" ? "Pro로 업그레이드" : "Max로 업그레이드"}
          </Button>
        </div>
      </div>
    </div>
  );
}
