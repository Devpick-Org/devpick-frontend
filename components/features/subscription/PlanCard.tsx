"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type PlanType } from "@/types/subscription";

interface PlanCardProps {
  plan: PlanType;
  currentPlan: PlanType;
}

const PLAN_META: Record<
  PlanType,
  { name: string; price: string; priceUnit: string | null; features: string[] }
> = {
  FREE: {
    name: "Free",
    price: "무료",
    priceUnit: null,
    features: [
      "홈 글 최신 50개 제공",
      "AI 요약/퀴즈 자신 레벨만",
      "AI 질문/답변 일 5회",
      "리포트 최근 1주만",
      "스킬갭 분석 주 2회",
      "면접 Q&A 생성 주 2회",
      "모의 면접 주 2회",
    ],
  },
  PRO: {
    name: "Pro",
    price: "9,900",
    priceUnit: "월",
    features: [
      "홈 글 무제한",
      "AI 요약/퀴즈 전 레벨",
      "AI 질문/답변 일 10회",
      "리포트 누적 제공",
      "스킬갭 분석 주 7회",
      "면접 Q&A 생성 주 7회",
      "모의 면접 주 7회",
    ],
  },
  MAX: {
    name: "Max",
    price: "19,900",
    priceUnit: "월",
    features: [
      "홈 글 무제한",
      "AI 요약/퀴즈 전 레벨",
      "AI 질문/답변 무제한",
      "리포트 누적 제공",
      "스킬갭 분석 무제한",
      "면접 Q&A 생성 무제한",
      "모의 면접 무제한",
    ],
  },
};

export function PlanCard({ plan, currentPlan }: PlanCardProps) {
  const meta = PLAN_META[plan];
  const isCurrent = currentPlan === plan;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
        isCurrent ? "border-2 border-primary" : "border-border"
      }`}
    >
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-muted-foreground">플랜</p>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-foreground">{meta.name}</h3>
          {plan === "PRO" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              인기
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          {meta.priceUnit ? (
            <>
              <span className="text-3xl font-bold text-foreground">
                ₩{meta.price}
              </span>
              <span className="text-sm text-muted-foreground">
                / {meta.priceUnit}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-foreground">
              {meta.price}
            </span>
          )}
        </div>
      </div>

      <ul className="mb-8 flex flex-col gap-3">
        {meta.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {isCurrent ? (
          <Badge className="w-full justify-center rounded-lg py-2 text-sm font-semibold bg-secondary text-muted-foreground hover:bg-secondary">
            현재 플랜
          </Badge>
        ) : (
          <Button asChild className="w-full font-semibold">
            <Link href={`/payment/billing?plan=${plan}`}>
              {meta.name} 시작하기
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
