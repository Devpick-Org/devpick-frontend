"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PlanCard } from "@/components/features/subscription/PlanCard";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { type PlanType } from "@/types/subscription";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "언제든지 구독을 취소할 수 있나요?",
    a: "네, 언제든지 구독을 취소할 수 있습니다. 취소 시 현재 결제 기간이 끝날 때까지 해당 플랜을 계속 이용할 수 있으며, 이후 자동으로 Free 플랜으로 전환됩니다. 즉시 Free 플랜으로 전환을 원하신다면 환불을 요청하실 수 있습니다.",
  },
  {
    q: "환불 정책이 어떻게 되나요?",
    a: "결제일로부터 7일 이내에는 환불을 요청하실 수 있습니다. 7일이 지난 후에는 환불이 어려우며, 구독 취소 후 기간 만료 시 Free 플랜으로 전환됩니다.",
  },
  {
    q: "플랜을 업그레이드하면 즉시 적용되나요?",
    a: "네, 업그레이드 결제가 완료되는 즉시 새 플랜의 모든 기능을 이용하실 수 있습니다. 기존 결제일은 유지되며, 차액은 일할 계산되어 다음 결제에 반영됩니다.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        {q}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </div>
  );
}

const COMPARISON_ROWS: {
  feature: string;
  FREE: string;
  PRO: string;
  MAX: string;
}[] = [
  { feature: "홈 제공 글 수", FREE: "최신 50개", PRO: "무제한", MAX: "무제한" },
  {
    feature: "AI 요약 / 퀴즈",
    FREE: "자신 레벨만",
    PRO: "전 레벨",
    MAX: "전 레벨",
  },
  {
    feature: "AI 질문 개선 / 답변",
    FREE: "일 5회",
    PRO: "일 10회",
    MAX: "무제한",
  },
  { feature: "리포트", FREE: "최근 1주만", PRO: "누적 제공", MAX: "누적 제공" },
  { feature: "히스토리 조회", FREE: "무제한", PRO: "무제한", MAX: "무제한" },
  {
    feature: "채용 공고 목록/상세",
    FREE: "무제한",
    PRO: "무제한",
    MAX: "무제한",
  },
  { feature: "스킬갭 분석", FREE: "주 2회", PRO: "주 7회", MAX: "무제한" },
  { feature: "면접 Q&A 조회", FREE: "무제한", PRO: "무제한", MAX: "무제한" },
  { feature: "면접 Q&A 생성", FREE: "주 2회", PRO: "주 7회", MAX: "무제한" },
  { feature: "모의 면접", FREE: "주 2회", PRO: "주 7회", MAX: "무제한" },
];

const PLANS: PlanType[] = ["FREE", "PRO", "MAX"];

export default function PlansPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const mounted = useHydrated();
  const currentPlan: PlanType = user?.planType ?? "FREE";

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  if (!mounted || !isInitialized || !isAuthenticated) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          나에게 맞는 플랜을 선택하세요
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          언제든지 업그레이드하거나 다운그레이드 할 수 있어요
        </p>
      </div>

      {/* 플랜 카드 */}
      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan} plan={plan} currentPlan={currentPlan} />
        ))}
      </div>

      {/* 기능 비교표 */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-foreground">기능 비교</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="py-3 pl-5 pr-3 text-left font-semibold text-foreground">
                  기능
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan}
                    className="px-4 py-3 text-center font-semibold text-foreground"
                  >
                    {plan === "FREE" ? "Free" : plan === "PRO" ? "Pro" : "Max"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}
                >
                  <td className="py-3 pl-5 pr-3 font-medium text-foreground">
                    {row.feature}
                  </td>
                  {PLANS.map((plan) => (
                    <td
                      key={plan}
                      className="px-4 py-3 text-center text-muted-foreground"
                    >
                      {row[plan]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 자주 묻는 질문 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          자주 묻는 질문
        </h2>
        <div className="rounded-xl border border-border bg-card px-6">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </main>
  );
}
