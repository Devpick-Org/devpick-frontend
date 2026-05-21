"use client";

import { useAuthStore } from "@/store/auth.store";
import { SubscriptionSection } from "@/components/features/profile/SubscriptionSection";
import { MOCK_SUBSCRIPTION_SCENARIOS } from "@/lib/mock/subscriptions";
import type { User } from "@/types/auth";

// ── 테스트 시나리오 ────────────────────────────────────────────────────────────

const BASE_USER: User = {
  userId: "test-user",
  email: "test@devpick.kr",
  nickname: "테스트유저",
};

function oneMonthLater(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SCENARIOS = [
  {
    label: "FREE (limits 없음 — 스켈레톤)",
    user: { ...BASE_USER, planType: "FREE" as const, planExpiredAt: null, lastBilledAt: null },
  },
  {
    label: "FREE (limits 있음)",
    user: { ...BASE_USER, ...MOCK_SUBSCRIPTION_SCENARIOS.FREE },
  },
  {
    label: "PRO — 정기갱신 중",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.PRO,
      lastBilledAt: daysAgo(10), // 10일 전 결제 → 환불 불가
    },
  },
  {
    label: "PRO — 정기갱신 + 환불 가능 (결제 3일째)",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.PRO,
      lastBilledAt: daysAgo(3),
    },
  },
  {
    label: "PRO — 해지 예정",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.PRO,
      planExpiredAt: oneMonthLater(),
      lastBilledAt: daysAgo(10),
    },
  },
  {
    label: "MAX — 정기갱신 중",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.MAX,
      lastBilledAt: daysAgo(10),
    },
  },
  {
    label: "MAX — 해지 예정",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.MAX,
      planExpiredAt: oneMonthLater(),
      lastBilledAt: daysAgo(10),
    },
  },
] as const;

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default function SubscriptionTestPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);

  const applyScenario = (index: number) => {
    const scenario = SCENARIOS[index];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAuth(scenario.user as any, "test-token");
  };

  const currentLabel = SCENARIOS.find(
    (s) =>
      s.user.planType === user?.planType &&
      s.user.planExpiredAt === user?.planExpiredAt &&
      s.user.lastBilledAt === user?.lastBilledAt,
  )?.label ?? "—";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-20 lg:px-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">구독 섹션 테스트</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          버튼으로 시나리오를 바꾸면 아래 섹션이 즉시 반영됩니다.
        </p>
      </div>

      {/* 시나리오 버튼 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => applyScenario(i)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              currentLabel === s.label
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 실제 컴포넌트 */}
      <SubscriptionSection />
    </div>
  );
}
