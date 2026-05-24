import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";
import type { BillingAuthRequest, SubscriptionChangeData, ChangePlanData } from "@/types/subscription";

export const subscriptionsEndpoints = {
  /** POST /subscriptions/billing-auth — 결제 + 플랜 업그레이드 */
  billingAuth: (data: BillingAuthRequest) =>
    apiClient.post<ApiResponse<SubscriptionChangeData>>("/subscriptions/billing-auth", data),

  /** DELETE /subscriptions — 구독 해지 (환불 없음, planExpiredAt까지 유지) */
  cancelSubscription: () =>
    apiClient.delete<ApiResponse<SubscriptionChangeData>>("/subscriptions"),

  /** POST /subscriptions/cancel — 결제 취소 + 즉시 환불 (7일 이내, 프론트에서만 버튼 노출 제어) */
  refundSubscription: () =>
    apiClient.post<ApiResponse<SubscriptionChangeData>>("/subscriptions/cancel"),

  /** POST /subscriptions/change — 다음 결제 구간부터 플랜 변경 예약 (PRO ↔ MAX) */
  changePlan: (planType: "PRO" | "MAX") =>
    apiClient.post<ApiResponse<ChangePlanData>>("/subscriptions/change", { planType }),

  /** POST /subscriptions/resume — 구독 해지 취소 (CANCELED → ACTIVE 복구) */
  resumeSubscription: () =>
    apiClient.post<ApiResponse<SubscriptionChangeData>>("/subscriptions/resume"),
};
