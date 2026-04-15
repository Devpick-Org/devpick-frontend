import { apiClient } from "../client";
import type {
  WeeklyReportResponse,
  WeeklyReportByIdResponse,
  WeeklyReportListResponse,
  WeeklyShareCreateResponse,
  WeeklySharedReportResponse,
  ReportExportOptions,
} from "@/types/report";

// ── query key 상수 ─────────────────────────────────────────────────────────────
export const REPORT_QUERY_KEYS = {
  weekly: ["reports", "weekly"] as const,
  weeklyById: (id: string) => ["reports", "weekly", id] as const,
  weeklyList: ["reports", "weekly", "list"] as const,
  sharedByToken: (token: string) =>
    ["reports", "weekly", "share", token] as const,
};

export const reportsEndpoints = {
  /** GET /reports/weekly — 이번 주 주간 리포트 */
  getWeeklyReport: (): Promise<WeeklyReportResponse> => {
    return apiClient
      .get<WeeklyReportResponse>("/reports/weekly")
      .then((r) => r.data);
  },

  /** GET /reports/weekly/list — 주간 리포트 목록 */
  getWeeklyReportList: (): Promise<WeeklyReportListResponse> => {
    return apiClient
      .get<WeeklyReportListResponse>("/reports/weekly/list")
      .then((r) => r.data);
  },

  /** GET /reports/weekly/{reportId} — 특정 주 리포트 */
  getWeeklyReportById: (reportId: string): Promise<WeeklyReportByIdResponse> => {
    return apiClient
      .get<WeeklyReportByIdResponse>(`/reports/weekly/${reportId}`)
      .then((r) => r.data);
  },

  /** POST /reports/weekly/{reportId}/share — 공유 링크 생성 */
  createWeeklyReportShare: (reportId: string): Promise<WeeklyShareCreateResponse> => {
    return apiClient
      .post<WeeklyShareCreateResponse>(`/reports/weekly/${reportId}/share`)
      .then((r) => r.data);
  },

  /** GET /reports/weekly/share/{token} — 공유 토큰으로 리포트 조회 (인증 불필요) */
  getWeeklyReportByShareToken: (token: string): Promise<WeeklySharedReportResponse> => {
    return apiClient
      .get<WeeklySharedReportResponse>(`/reports/weekly/share/${token}`)
      .then((r) => r.data);
  },

  /**
   * 클라이언트 PDF export — 서버 저장 API 아님
   * 실제 PDF 생성은 lib/report/exportPdf.ts의 exportReportAsPdf()로 처리
   */
  exportWeeklyReport: (_options: ReportExportOptions): Promise<void> => {
    return Promise.resolve();
  },
};
