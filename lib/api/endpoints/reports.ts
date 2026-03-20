import type {
  WeeklyReportResponse,
  WeeklyReportByIdResponse,
  WeeklyReportListResponse,
  WeeklyShareCreateResponse,
  WeeklySharedReportResponse,
  ReportExportOptions,
} from "@/types/report";
import {
  mockGetWeeklyReport,
  mockGetWeeklyReportById,
  mockGetWeeklyReportList,
  mockCreateWeeklyReportShare,
  mockGetWeeklyReportByShareToken,
  mockExportWeeklyReport,
} from "@/lib/mock/reports";

// TODO: 실제 API 연동 시 아래 import를 활성화하고 각 함수 내부를 교체
// import { apiClient } from "../client";

// ── query key 상수 ─────────────────────────────────────────────────────────────
export const REPORT_QUERY_KEYS = {
  weekly: ["reports", "weekly"] as const,
  weeklyById: (id: string) => ["reports", "weekly", id] as const,
  weeklyList: ["reports", "weekly", "list"] as const,
  // app/report/share/[token]/page.tsx 에서 사용
  sharedByToken: (token: string) =>
    ["reports", "weekly", "share", token] as const,
};

export const reportsEndpoints = {
  /** GET /reports/weekly — 이번 주 주간 리포트 (인증 필요) */
  getWeeklyReport: (): Promise<WeeklyReportResponse> => {
    return mockGetWeeklyReport();
    // TODO: return apiClient.get<WeeklyReportResponse>("/reports/weekly").then((r) => r.data);
  },

  /** 주간 리포트 목록 요약 — 드롭다운 선택 UI용 */
  getWeeklyReportList: (): Promise<WeeklyReportListResponse> => {
    return mockGetWeeklyReportList();
    // TODO: return apiClient.get<WeeklyReportListResponse>("/reports/weekly/list").then((r) => r.data);
  },

  /** GET /reports/weekly/{reportId} — 특정 주 리포트 (인증 필요) */
  getWeeklyReportById: (
    reportId: string,
  ): Promise<WeeklyReportByIdResponse> => {
    return mockGetWeeklyReportById(reportId);
    // TODO: return apiClient.get<WeeklyReportByIdResponse>(`/reports/weekly/${reportId}`).then((r) => r.data);
  },

  /** POST /reports/weekly/{reportId}/share — 공유 링크 생성 (인증 필요) */
  createWeeklyReportShare: (
    reportId: string,
  ): Promise<WeeklyShareCreateResponse> => {
    return mockCreateWeeklyReportShare(reportId);
    // TODO: return apiClient.post<WeeklyShareCreateResponse>(`/reports/weekly/${reportId}/share`).then((r) => r.data);
  },

  /** GET /reports/weekly/share/{token} — 공유 토큰으로 리포트 조회 (인증 불필요) */
  getWeeklyReportByShareToken: (
    token: string,
  ): Promise<WeeklySharedReportResponse> => {
    return mockGetWeeklyReportByShareToken(token);
    // TODO: return apiClient.get<WeeklySharedReportResponse>(`/reports/weekly/share/${token}`).then((r) => r.data);
  },

  /**
   * 클라이언트 PDF export — 서버 저장 API 아님
   * TODO: mockExportWeeklyReport를 실제 PDF 생성 함수로 교체
   */
  exportWeeklyReport: (options: ReportExportOptions): Promise<void> => {
    return mockExportWeeklyReport(options);
  },
};
