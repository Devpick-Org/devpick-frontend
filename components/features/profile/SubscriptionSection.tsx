"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useAuthStore } from "@/store/auth.store";
import { subscriptionsEndpoints } from "@/lib/api/endpoints/subscriptions";
import { extractApiError } from "@/lib/api/extractApiError";
import type { LimitInfo } from "@/types/subscription";

// ── 상수 ──────────────────────────────────────────────────────────────────────

const LIMIT_ROWS = [
  { key: "aiDaily" as const,                   label: "AI 질문 개선/답변", resetLabel: "매일 자정 초기화" },
  { key: "skillBoostWeekly" as const,          label: "부족 역량 보완",    resetLabel: "매주 월요일 초기화" },
  { key: "interviewQaGenerateWeekly" as const, label: "면접 Q&A",          resetLabel: "매주 월요일 초기화" },
  { key: "mockInterviewWeekly" as const,       label: "모의 면접",          resetLabel: "매주 월요일 초기화" },
] as const;

const PLAN_PRICE: Record<"PRO" | "MAX", string> = {
  PRO: "₩9,900",
  MAX: "₩19,900",
};

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function addOneMonth(iso: string): Date {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + 1);
  return d;
}

function formatDotDate(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatKorDate(d: Date): string {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ── 사용량 행 ─────────────────────────────────────────────────────────────────

function UsageRow({
  label,
  resetLabel,
  info,
}: {
  label: string;
  resetLabel: string;
  info: LimitInfo;
}) {
  const isUnlimited = info.remaining === -1;
  const isExhausted = !isUnlimited && info.remaining === 0;
  const pct =
    isUnlimited || info.max <= 0
      ? 0
      : Math.min(100, (info.used / info.max) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {isUnlimited ? (
          <span className="text-sm font-semibold text-muted-foreground">무제한</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                isExhausted ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {info.used} / {info.max}
            </span>
            {isExhausted && (
              <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
                소진
              </span>
            )}
          </div>
        )}
      </div>
      {!isUnlimited && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isExhausted ? "bg-destructive" : "bg-primary/70",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <p className="mt-1 text-xs text-muted-foreground">{resetLabel}</p>
    </div>
  );
}

// ── 플랜 배지 ─────────────────────────────────────────────────────────────────

function PlanBadge({ planType }: { planType: string }) {
  if (planType === "FREE") {
    return (
      <span className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground">
        Free
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold",
        planType === "PRO"
          ? "bg-foreground text-background"
          : "bg-amber-400 text-amber-950",
      )}
    >
      <Crown className="h-3.5 w-3.5" />
      {planType === "PRO" ? "Pro" : "Max"}
    </span>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function SubscriptionSection() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const planType = user?.planType ?? "FREE";
  const isActive = planType !== "FREE";
  // planExpiredAt === null → 정기갱신 중, non-null → 해지 예정
  const isExpiring = isActive && !!user?.planExpiredAt;
  const isRenewing = isActive && !user?.planExpiredAt;

  // 환불 버튼: lastBilledAt 기준 7일 이내만 노출 (프론트 전용 제어)
  const canRefund = !!(
    user?.lastBilledAt &&
    new Date() <
      new Date(
        new Date(user.lastBilledAt).getTime() + 7 * 24 * 60 * 60 * 1000,
      )
  );

  // 다음 결제일 = lastBilledAt + 1개월 (정기갱신 상태에서 planExpiredAt은 null)
  const nextBillingDate =
    isRenewing && user?.lastBilledAt
      ? formatDotDate(addOneMonth(user.lastBilledAt))
      : null;

  // 해지 모달 설명: 예상 만료일을 lastBilledAt + 1개월로 계산
  const estimatedExpiry =
    user?.lastBilledAt ? formatKorDate(addOneMonth(user.lastBilledAt)) : null;

  const limits = user?.limits;

  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      const res = await subscriptionsEndpoints.cancelSubscription();
      updateUser({ planExpiredAt: res.data.planExpiredAt });
      const expiredLabel = res.data.planExpiredAt
        ? formatKorDate(new Date(res.data.planExpiredAt))
        : "";
      toast.success(`${expiredLabel}까지 이용 가능합니다.`);
    } catch (e) {
      const { message } = extractApiError(e);
      toast.error(message ?? "구독 해지 중 오류가 발생했습니다.");
    } finally {
      setIsCanceling(false);
      setShowCancelModal(false);
    }
  };

  const handleRefund = async () => {
    setIsRefunding(true);
    try {
      await subscriptionsEndpoints.refundSubscription();
      updateUser({ planType: "FREE", planExpiredAt: null, lastBilledAt: null });
      toast.success("환불이 완료됐습니다. 즉시 Free 플랜으로 전환됩니다.");
    } catch (e) {
      const { message } = extractApiError(e);
      toast.error(message ?? "환불 처리 중 오류가 발생했습니다.");
    } finally {
      setIsRefunding(false);
      setShowRefundModal(false);
    }
  };

  return (
    <section className="mb-8 rounded-2xl bg-background p-6">
      <h2 className="mb-5 text-lg font-semibold text-foreground">내 플랜</h2>

      {/* 플랜 헤더 */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <PlanBadge planType={planType} />

        {planType === "FREE" && (
          <Button size="sm" onClick={() => router.push("/plans")}>
            Pro/Max로 업그레이드
          </Button>
        )}

        {isRenewing && nextBillingDate && (
          <span className="text-sm text-muted-foreground">
            다음 결제일{" "}
            <span className="font-semibold text-foreground">{nextBillingDate}</span>
            {" · "}
            {PLAN_PRICE[planType as "PRO" | "MAX"]}
          </span>
        )}

        {isExpiring && (
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatKorDate(new Date(user!.planExpiredAt!))}
            </span>
            까지 이용 가능
            <span className="ml-1 text-xs">(해지 예정)</span>
          </span>
        )}
      </div>

      {/* 이번 주 사용량 */}
      <div className="mb-5">
        <p className="mb-4 text-sm font-bold text-foreground">이번 주 사용량</p>
        <div className="flex flex-col gap-4">
          {limits
            ? LIMIT_ROWS.map((row) => (
                <UsageRow
                  key={row.key}
                  label={row.label}
                  resetLabel={row.resetLabel}
                  info={limits[row.key]}
                />
              ))
            : (
                <>
                  {LIMIT_ROWS.map((row) => (
                    <div key={row.key}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{row.label}</span>
                        <div className="h-4 w-8 animate-pulse rounded bg-muted" />
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                        <div className="h-full w-1/3 animate-pulse rounded-full bg-muted" />
                      </div>
                      <div className="mt-1 h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-muted-foreground">
                    사용량 정보를 불러오는 중이에요. 잠시 후 다시 확인해 주세요.
                  </p>
                </>
              )}
        </div>
      </div>

      {/* 하단 액션 — 정기갱신 중 */}
      {isRenewing && (
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            {planType === "PRO" && (
              <button
                type="button"
                onClick={() => router.push("/plans")}
                className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
              >
                Max 플랜으로 업그레이드
              </button>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              구독 해지
            </button>
            {canRefund && (
              <button
                type="button"
                onClick={() => setShowRefundModal(true)}
                className="cursor-pointer text-xs text-muted-foreground/70 underline-offset-2 hover:underline"
              >
                결제 취소 및 환불
              </button>
            )}
          </div>
        </div>
      )}

      {/* 하단 액션 — 해지 예정 */}
      {isExpiring && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/plans")}
            className="cursor-pointer text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
          >
            다시 구독하기
          </button>
        </div>
      )}

      {/* 해지 확인 다이얼로그 */}
      <ConfirmModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="정말 해지하시겠어요?"
        description={
          estimatedExpiry
            ? `${estimatedExpiry}까지 이용 후 자동으로 Free 플랜으로 전환됩니다.`
            : "현재 결제 기간이 끝나면 자동으로 Free 플랜으로 전환됩니다."
        }
        cancelText="취소"
        confirmText="해지"
        onConfirm={handleCancel}
        isLoading={isCanceling}
        variant="danger"
      />

      {/* 환불 확인 다이얼로그 */}
      <ConfirmModal
        open={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="결제를 취소하시겠어요?"
        description="즉시 Free 플랜으로 전환되며 환불 처리됩니다."
        cancelText="취소"
        confirmText="환불 요청"
        onConfirm={handleRefund}
        isLoading={isRefunding}
        variant="danger"
      />
    </section>
  );
}
