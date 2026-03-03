import { apiClient } from "../client";

// TODO: DP-report (주간 리포트 화면 개발) 시 구현
export const reportsEndpoints = {
  /** GET /reports/weekly — 이번 주 리포트 */
  getWeeklyReport: () => {
    throw new Error("Not implemented");
    return apiClient.get("/reports/weekly");
  },

  /** GET /reports/weekly/:reportId — 특정 주 리포트 (reportId: number) */
  getWeeklyReportById: () => {
    throw new Error("Not implemented");
    return apiClient.get("/reports/weekly/0");
  },

  /** POST /reports/weekly/share — 공유 링크 생성 */
  shareWeeklyReport: () => {
    throw new Error("Not implemented");
    return apiClient.post("/reports/weekly/share");
  },
};
