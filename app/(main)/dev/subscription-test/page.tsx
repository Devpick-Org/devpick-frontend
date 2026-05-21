"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { SubscriptionSection } from "@/components/features/profile/SubscriptionSection";
import { MOCK_SUBSCRIPTION_SCENARIOS } from "@/lib/mock/subscriptions";
import type { User } from "@/types/auth";

// ── 테스트 시나리오 ────────────────────────────────────────────────────────────

const BASE_USER: User = {
  userId: "test-user",
  email: "test@devpick.kr",
  nickname: "테스트유저",
  level: "JUNIOR",
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
  {
    label: "PRO — Max로 변경 예약됨",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.PRO,
      lastBilledAt: daysAgo(10),
      pendingPlanType: "MAX" as const,
    },
  },
  {
    label: "MAX — Pro로 변경 예약됨",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.MAX,
      lastBilledAt: daysAgo(10),
      pendingPlanType: "PRO" as const,
    },
  },
] as const;

// ── Phase 6 테스트 시나리오 ───────────────────────────────────────────────────

const PHASE6_SCENARIOS = [
  {
    label: "FREE · JUNIOR · limits 있음",
    desc: "AI 요약/퀴즈: JUNIOR 탭만 해제 / AI 개선 3회 남음",
    user: { ...BASE_USER, level: "JUNIOR", ...MOCK_SUBSCRIPTION_SCENARIOS.FREE },
  },
  {
    label: "FREE · AI 개선 소진 (remaining=0)",
    desc: "AI 개선 버튼 비활성화 확인",
    user: {
      ...BASE_USER,
      level: "JUNIOR",
      ...MOCK_SUBSCRIPTION_SCENARIOS.FREE,
      limits: {
        ...MOCK_SUBSCRIPTION_SCENARIOS.FREE.limits,
        aiDaily: { used: 5, max: 5, remaining: 0, resetsAt: (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setUTCHours(0,0,0,0); return d.toISOString(); })() },
      },
    },
  },
  {
    label: "PRO · MIDDLE · limits 있음",
    desc: "AI 요약/퀴즈: 전 레벨 해제 / AI 개선 7회 남음",
    user: { ...BASE_USER, level: "MIDDLE", ...MOCK_SUBSCRIPTION_SCENARIOS.PRO },
  },
  {
    label: "MAX · limits 무제한",
    desc: "AI 개선 무제한 / 모든 레벨 해제",
    user: { ...BASE_USER, level: "SENIOR", ...MOCK_SUBSCRIPTION_SCENARIOS.MAX },
  },
] as const;

// ── Phase 7 테스트 시나리오 ──────────────────────────────────────────────────

function nextMondayUTC(): string {
  const d = new Date();
  const daysUntilMonday = d.getUTCDay() === 0 ? 1 : 8 - d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + daysUntilMonday);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

const PHASE7_SCENARIOS = [
  {
    label: "FREE · 각 기능 1회 남음",
    desc: "skillBoost 1 / qaGenerate 2 / mockInterview 2",
    user: { ...BASE_USER, ...MOCK_SUBSCRIPTION_SCENARIOS.FREE },
  },
  {
    label: "FREE · 부족역량 소진",
    desc: "skillBoostWeekly remaining=0",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.FREE,
      limits: {
        ...MOCK_SUBSCRIPTION_SCENARIOS.FREE.limits,
        skillBoostWeekly: { used: 2, max: 2, remaining: 0, resetsAt: nextMondayUTC() },
      },
    },
  },
  {
    label: "FREE · 면접 Q&A 소진",
    desc: "interviewQaGenerateWeekly remaining=0",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.FREE,
      limits: {
        ...MOCK_SUBSCRIPTION_SCENARIOS.FREE.limits,
        interviewQaGenerateWeekly: { used: 2, max: 2, remaining: 0, resetsAt: nextMondayUTC() },
      },
    },
  },
  {
    label: "FREE · 모의면접 소진",
    desc: "mockInterviewWeekly remaining=0",
    user: {
      ...BASE_USER,
      ...MOCK_SUBSCRIPTION_SCENARIOS.FREE,
      limits: {
        ...MOCK_SUBSCRIPTION_SCENARIOS.FREE.limits,
        mockInterviewWeekly: { used: 2, max: 2, remaining: 0, resetsAt: nextMondayUTC() },
      },
    },
  },
  {
    label: "PRO · 5/7회 남음",
    desc: "각 기능 잔여 횟수 확인",
    user: { ...BASE_USER, ...MOCK_SUBSCRIPTION_SCENARIOS.PRO },
  },
  {
    label: "MAX · 무제한",
    desc: "remaining=-1, resetsAt=null",
    user: { ...BASE_USER, ...MOCK_SUBSCRIPTION_SCENARIOS.MAX },
  },
  {
    label: "limits 없음 (백엔드 미연동)",
    desc: "UI 숨김 확인",
    user: { ...BASE_USER, planType: "FREE" as const, planExpiredAt: null, lastBilledAt: null },
  },
] as const;

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default function SubscriptionTestPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [jobId, setJobId] = useState("");

  const applyScenario = (u: User) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAuth(u as any, "test-token");
  };

  const currentLabel = SCENARIOS.find(
    (s) =>
      s.user.planType === user?.planType &&
      s.user.planExpiredAt === user?.planExpiredAt &&
      s.user.lastBilledAt === user?.lastBilledAt,
  )?.label ?? "—";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-20 lg:px-0">
      {/* ── Phase 5: 구독 섹션 ── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">구독 섹션 테스트 (Phase 5)</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          버튼으로 시나리오를 바꾸면 아래 섹션이 즉시 반영됩니다.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => applyScenario(s.user as User)}
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

      <SubscriptionSection />

      {/* ── Phase 6: 플랜 제한 UI ── */}
      <div className="mt-16 mb-6 border-t border-border pt-10">
        <h2 className="text-lg font-bold text-foreground">Phase 6 — 플랜 제한 UI 테스트</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          시나리오 적용 후 아래 링크로 이동해서 확인하세요.
          현재 플랜: <span className="font-semibold text-foreground">{user?.planType ?? "없음"}</span>
          {" · "}레벨: <span className="font-semibold text-foreground">{user?.level ?? "없음"}</span>
          {" · "}AI 남은 횟수: <span className="font-semibold text-foreground">{user?.limits?.aiDaily?.remaining ?? "—"}</span>
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {PHASE6_SCENARIOS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => applyScenario(s.user as unknown as User)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              user?.planType === s.user.planType && user?.level === s.user.level && user?.limits?.aiDaily?.remaining === s.user.limits?.aiDaily?.remaining
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
            title={s.desc}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { href: "/home", label: "홈 피드", desc: "planLimited 배너" },
          { href: "/community/write", label: "커뮤니티 글쓰기", desc: "AI 개선 남은 횟수" },
          { href: "/report", label: "주간 리포트", desc: "locked 항목 잠금" },
          { href: "/plans", label: "플랜 소개", desc: "버튼 분기 확인" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col gap-0.5 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-muted"
          >
            <span className="font-semibold text-foreground">{link.label}</span>
            <span className="text-xs text-muted-foreground">{link.desc}</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        AI 요약·퀴즈 레벨 잠금은 홈 글 상세 페이지(/home/[id])에서 확인하세요.
      </p>

      {/* ── Phase 7: 채용 기능 limits UI ── */}
      <div className="mt-16 mb-6 border-t border-border pt-10">
        <h2 className="text-lg font-bold text-foreground">Phase 7 — 채용 기능 limits UI 테스트</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          시나리오 적용 후 공고 상세 페이지에서 부족역량·면접Q&A·모의면접 섹션을 확인하세요.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span>
            플랜: <span className="font-semibold text-foreground">{user?.planType ?? "없음"}</span>
          </span>
          <span>
            부족역량: <span className="font-semibold text-foreground">{user?.limits?.skillBoostWeekly?.remaining ?? "—"}</span>회 남음
          </span>
          <span>
            면접Q&A 생성: <span className="font-semibold text-foreground">{user?.limits?.interviewQaGenerateWeekly?.remaining ?? "—"}</span>회 남음
          </span>
          <span>
            모의면접: <span className="font-semibold text-foreground">{user?.limits?.mockInterviewWeekly?.remaining ?? "—"}</span>회 남음
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {PHASE7_SCENARIOS.map((s) => {
          const isActive =
            user?.planType === s.user.planType &&
            user?.limits?.skillBoostWeekly?.remaining === (s.user as { limits?: { skillBoostWeekly?: { remaining: number } } }).limits?.skillBoostWeekly?.remaining &&
            user?.limits?.interviewQaGenerateWeekly?.remaining === (s.user as { limits?: { interviewQaGenerateWeekly?: { remaining: number } } }).limits?.interviewQaGenerateWeekly?.remaining &&
            user?.limits?.mockInterviewWeekly?.remaining === (s.user as { limits?: { mockInterviewWeekly?: { remaining: number } } }).limits?.mockInterviewWeekly?.remaining;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => applyScenario(s.user as unknown as User)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
              title={s.desc}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          placeholder="공고 ID 입력 (예: abc123)"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          disabled={!jobId.trim()}
          onClick={() => router.push(`/jobs/${jobId.trim()}`)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          공고 상세로 이동
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        이동 후 &ldquo;부족 역량 보완&rdquo;, &ldquo;예상 면접 Q&A&rdquo;, &ldquo;AI 모의면접&rdquo; 섹션에서 limits UI를 확인하세요.
      </p>
    </div>
  );
}
