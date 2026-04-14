import type { ApiResponse } from "./api";

/** 이번 주 활동 요약 — GET /reports/weekly 응답의 activities 항목 */
export interface WeeklyActivity {
  contentsRead: number;
  questionsCreated: number;
  scrapsCount: number;
  /** JSON 배열 문자열 또는 쉼표 구분 — 백엔드에서 null 가능 */
  topTags: string | null;
  /** 전주 대비 — 미계산 시 null */
  prevWeekComparison: string | null;
}

/** 요일별 활동량 — chartData.dailyActivities 항목 */
export interface DailyActivity {
  dayOfWeek: string;
  count: number;
}

/** 태그별 활동량 — chartData.tagActivities 항목 */
export interface TagActivity {
  tagName: string;
  count: number;
}

/** 차트 데이터 — 바 차트(요일별) + 레이더 차트(태그별) */
export interface ChartData {
  dailyActivities: DailyActivity[];
  tagActivities: TagActivity[];
}

/**
 * AI 인사이트
 * TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
 */
export interface AiInsight {
  wellDone: string | null;
  lacking: string | null;
  nextWeek: string | null;
}

/** 주간 리포트 DTO — GET /reports/weekly, /reports/weekly/{reportId} 공통 응답 */
export interface WeeklyReport {
  reportId: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  isShared: boolean;
  activities: WeeklyActivity[];
  // TODO: 실제 API 연동 시 교체 예정
  chartData: ChartData;
  // TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
  aiInsight: AiInsight | null;
}

/** POST /reports/weekly/{reportId}/share 응답 data */
export interface ShareReportData {
  reportId: string;
  shareToken: string;
}

/** 주간 리포트 선택 UI용 요약 타입 (드롭다운 목록 항목) */
export interface WeeklyReportSummary {
  reportId: string;
  weekStart: string;
  weekEnd: string;
  status: string;
}

export type WeeklyReportResponse = ApiResponse<WeeklyReport>;
export type WeeklyReportByIdResponse = ApiResponse<WeeklyReport>;
export type WeeklyShareCreateResponse = ApiResponse<ShareReportData>;
export type WeeklySharedReportResponse = ApiResponse<WeeklyReport>;
export type WeeklyReportListResponse = ApiResponse<WeeklyReportSummary[]>;

// ── 클라이언트 export 전용 타입 (서버 저장 API 아님) ──────────────────────────

/** 저장 포맷 — 추후 "image" | "csv" 확장 가능 */
export type ReportExportFormat = "pdf";

export interface ReportExportOptions {
  format: ReportExportFormat;
  reportId: string;
}
