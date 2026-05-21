export type PlanType = 'FREE' | 'PRO' | 'MAX';

export interface LimitInfo {
  used: number;
  max: number;        // -1 = 무제한 (MAX 플랜)
  remaining: number;  // -1 = 무제한 (MAX 플랜)
  resetsAt: string | null; // ISO 8601 UTC. MAX 플랜은 null
}

export interface UserLimits {
  aiDaily: LimitInfo;
  skillBoostWeekly: LimitInfo;
  interviewQaGenerateWeekly: LimitInfo;
  mockInterviewWeekly: LimitInfo;
}

export interface BillingAuthRequest {
  authKey: string;
  customerKey: string;
  planType: 'PRO' | 'MAX';
}

export interface SubscriptionChangeData {
  planType: PlanType;
  planExpiredAt: string | null;
}

export interface ChangePlanData {
  currentPlanType: PlanType;
  pendingPlanType: PlanType;
  changeEffectiveAt: string;
}
