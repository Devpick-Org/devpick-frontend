import type { UserLimits, SubscriptionChangeData } from "@/types/subscription";
import type { ApiResponse } from "@/types/api";

function nextMidnightUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function nextMondayUTC(): string {
  const d = new Date();
  const daysUntilMonday = d.getUTCDay() === 0 ? 1 : 8 - d.getUTCDay();
  d.setUTCDate(d.getUTCDate() + daysUntilMonday);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function oneMonthLater(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
}

export const MOCK_SUBSCRIPTION_SCENARIOS = {
  FREE: {
    planType: "FREE" as const,
    planExpiredAt: null,
    lastBilledAt: null,
    limits: {
      aiDaily:                   { used: 2, max: 5,  remaining: 3, resetsAt: nextMidnightUTC() },
      skillBoostWeekly:          { used: 1, max: 2,  remaining: 1, resetsAt: nextMondayUTC() },
      interviewQaGenerateWeekly: { used: 0, max: 2,  remaining: 2, resetsAt: nextMondayUTC() },
      mockInterviewWeekly:       { used: 0, max: 2,  remaining: 2, resetsAt: nextMondayUTC() },
    } satisfies UserLimits,
  },
  PRO: {
    planType: "PRO" as const,
    planExpiredAt: null,
    lastBilledAt: new Date().toISOString(),
    limits: {
      aiDaily:                   { used: 3, max: 10, remaining: 7, resetsAt: nextMidnightUTC() },
      skillBoostWeekly:          { used: 2, max: 7,  remaining: 5, resetsAt: nextMondayUTC() },
      interviewQaGenerateWeekly: { used: 1, max: 7,  remaining: 6, resetsAt: nextMondayUTC() },
      mockInterviewWeekly:       { used: 0, max: 7,  remaining: 7, resetsAt: nextMondayUTC() },
    } satisfies UserLimits,
  },
  MAX: {
    planType: "MAX" as const,
    planExpiredAt: null,
    lastBilledAt: new Date().toISOString(),
    limits: {
      aiDaily:                   { used: 0, max: -1, remaining: -1, resetsAt: null },
      skillBoostWeekly:          { used: 0, max: -1, remaining: -1, resetsAt: null },
      interviewQaGenerateWeekly: { used: 0, max: -1, remaining: -1, resetsAt: null },
      mockInterviewWeekly:       { used: 0, max: -1, remaining: -1, resetsAt: null },
    } satisfies UserLimits,
  },
};

export function MOCK_BILLING_AUTH(planType: "PRO" | "MAX"): ApiResponse<SubscriptionChangeData> {
  return {
    success: true,
    data: { planType, planExpiredAt: oneMonthLater() },
    message: "결제가 완료됐습니다.",
  };
}

export function MOCK_CANCEL_SUBSCRIPTION(): ApiResponse<SubscriptionChangeData> {
  return {
    success: true,
    data: { planType: "PRO", planExpiredAt: oneMonthLater() },
    message: "구독이 해지됐습니다.",
  };
}

export function MOCK_REFUND_SUBSCRIPTION(): ApiResponse<SubscriptionChangeData> {
  return {
    success: true,
    data: { planType: "FREE", planExpiredAt: null },
    message: "환불이 완료됐습니다.",
  };
}
