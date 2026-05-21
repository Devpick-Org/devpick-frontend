import type { ApiResponse } from "@/types/api";
import type { BillingAuthRequest, SubscriptionChangeData, ChangePlanData } from "@/types/subscription";
import {
  MOCK_BILLING_AUTH,
  MOCK_CANCEL_SUBSCRIPTION,
  MOCK_REFUND_SUBSCRIPTION,
  MOCK_CHANGE_PLAN,
} from "@/lib/mock/subscriptions";

// DP-509에서 mock → axios 실제 호출로 교체 예정
export const subscriptionsEndpoints = {
  /** POST /subscriptions/billing-auth — 결제 + 플랜 업그레이드 */
  billingAuth: (data: BillingAuthRequest): Promise<ApiResponse<SubscriptionChangeData>> =>
    Promise.resolve(MOCK_BILLING_AUTH(data.planType)),

  /** DELETE /subscriptions — 구독 해지 (환불 없음, planExpiredAt까지 유지) */
  cancelSubscription: (): Promise<ApiResponse<SubscriptionChangeData>> =>
    Promise.resolve(MOCK_CANCEL_SUBSCRIPTION()),

  /** POST /subscriptions/cancel — 결제 취소 + 즉시 환불 (7일 이내, 프론트에서만 버튼 노출 제어) */
  refundSubscription: (): Promise<ApiResponse<SubscriptionChangeData>> =>
    Promise.resolve(MOCK_REFUND_SUBSCRIPTION()),

  /** POST /subscriptions/change — 다음 결제 구간부터 플랜 변경 예약 (PRO ↔ MAX) */
  changePlan: (planType: "PRO" | "MAX"): Promise<ApiResponse<ChangePlanData>> =>
    Promise.resolve(MOCK_CHANGE_PLAN(planType)),
};
