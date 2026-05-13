import { apiClient } from "../client";
import type { ApiResponse } from "@/types/api";

export type MockInterviewStatus = "IN_PROGRESS" | "PROCESSING" | "COMPLETED" | "EARLY_FINISHED";
export type MockInterviewMode = "FULL" | "PINPOINT";
export type MockInterviewPhase =
  | "WARM_UP"
  | "PROJECT"
  | "DOMAIN"
  | "CS_INFRA"
  | "BEHAVIORAL";
export type MockInterviewTurnType =
  | "QUESTION"
  | "ANSWER"
  | "FOLLOW_UP_QUESTION"
  | "FOLLOW_UP_ANSWER"
  | "RETRY_REQUEST"
  | "RETRY_ANSWER"
  | "PASS";
export type MockInterviewRating = "GOOD" | "OK" | "WEAK";

export interface MockInterviewModelOption {
  key: string;
  label: string;
  description: string;
  experimental: boolean;
}

export interface AvailableModelsApi {
  models: MockInterviewModelOption[];
  defaultKey: string;
}

export interface MockInterviewQuestionPlanItem {
  questionNo: number;
  phase: MockInterviewPhase;
  topic: string;
  prompt: string;
  jdOnlyKeyword: boolean;
  keywords: string[];
}

export interface MockInterviewQuestionPlan {
  questions: MockInterviewQuestionPlanItem[];
  coreCsTopics: string[];
  extendedCsTopics: string[];
  jdGapKeywords: string[];
  domainLabel: string;
}

export interface MockInterviewTurnApi {
  orderNo: number;
  questionNo: number;
  phase: MockInterviewPhase;
  type: MockInterviewTurnType;
  content: string;
  rating: MockInterviewRating | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface MockInterviewSessionDetailApi {
  id: string;
  jobId: string | null;
  jobTitle: string;
  companyName: string;
  jobCategory: string | null;
  rawJdText: string;
  status: MockInterviewStatus;
  mode: MockInterviewMode;
  modelKey: string;
  phase: MockInterviewPhase;
  currentQuestionIndex: number;
  answeredCount: number;
  totalQuestions: number;
  plan: MockInterviewQuestionPlan;
  turns: MockInterviewTurnApi[];
  resultJson: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockInterviewSessionListItemApi {
  id: string;
  jobId: string | null;
  jobTitle: string;
  companyName: string;
  status: MockInterviewStatus;
  mode: MockInterviewMode;
  modelKey: string;
  phase: MockInterviewPhase;
  currentQuestionIndex: number;
  answeredCount: number;
  totalQuestions: number;
  overallScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryListApi {
  sessions: MockInterviewSessionListItemApi[];
  max: number;
}

export interface AnswerOutcomeApi {
  questionNo: number;
  rating: MockInterviewRating | null;
  evaluatorComment: string | null;
  followUpQuestion: string | null;
  retryHint: string | null;
  moveToNext: boolean;
  sessionCompleted: boolean;
  session: MockInterviewSessionDetailApi;
}

export interface StartFromJobBody {
  modelKey: string;
  mode: MockInterviewMode;
}

export interface StartFromJdBody {
  companyName: string;
  jobTitle: string;
  jobCategory?: string;
  rawJdText?: string;
  modelKey: string;
  mode: MockInterviewMode;
}

export const mockInterviewsEndpoints = {
  models: (): Promise<AvailableModelsApi> =>
    apiClient
      .get<ApiResponse<AvailableModelsApi>>("/jobs/mock-interviews/models")
      .then((r) => r.data.data),

  list: (): Promise<HistoryListApi> =>
    apiClient
      .get<ApiResponse<HistoryListApi>>("/jobs/mock-interviews")
      .then((r) => r.data.data),

  get: (sessionId: string): Promise<MockInterviewSessionDetailApi> =>
    apiClient
      .get<ApiResponse<MockInterviewSessionDetailApi>>(`/jobs/mock-interviews/${sessionId}`)
      .then((r) => r.data.data),

  startFromJob: (jobId: string, body: StartFromJobBody): Promise<MockInterviewSessionDetailApi> =>
    apiClient
      .post<ApiResponse<MockInterviewSessionDetailApi>>(
        `/jobs/mock-interviews/start/job/${jobId}`,
        body,
      )
      .then((r) => r.data.data),

  startFromJd: (body: StartFromJdBody): Promise<MockInterviewSessionDetailApi> =>
    apiClient
      .post<ApiResponse<MockInterviewSessionDetailApi>>(
        `/jobs/mock-interviews/start`,
        body,
      )
      .then((r) => r.data.data),

  answer: (
    sessionId: string,
    questionNo: number,
    content: string,
  ): Promise<AnswerOutcomeApi> =>
    apiClient
      .post<ApiResponse<AnswerOutcomeApi>>(
        `/jobs/mock-interviews/${sessionId}/answer`,
        { questionNo, content },
      )
      .then((r) => r.data.data),

  pass: (
    sessionId: string,
    questionNo: number,
  ): Promise<MockInterviewSessionDetailApi> =>
    apiClient
      .post<ApiResponse<MockInterviewSessionDetailApi>>(
        `/jobs/mock-interviews/${sessionId}/pass`,
        { questionNo },
      )
      .then((r) => r.data.data),

  saveAndExit: (sessionId: string): Promise<MockInterviewSessionDetailApi> =>
    apiClient
      .post<ApiResponse<MockInterviewSessionDetailApi>>(
        `/jobs/mock-interviews/${sessionId}/save-exit`,
      )
      .then((r) => r.data.data),

  finishEarly: (sessionId: string): Promise<MockInterviewSessionDetailApi> =>
    apiClient
      .post<ApiResponse<MockInterviewSessionDetailApi>>(
        `/jobs/mock-interviews/${sessionId}/finish-early`,
      )
      .then((r) => r.data.data),

  delete: (sessionId: string): Promise<void> =>
    apiClient
      .delete<ApiResponse<void>>(`/jobs/mock-interviews/${sessionId}`)
      .then(() => undefined),

  deleteMany: (sessionIds: string[]): Promise<void> =>
    apiClient
      .delete<ApiResponse<void>>(`/jobs/mock-interviews`, {
        data: { sessionIds },
      })
      .then(() => undefined),
};
