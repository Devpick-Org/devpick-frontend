import type { ApiResponse } from "./api";

export interface PrevWeekComparisonDeltas {
  contentsRead: number;
  questionsCreated: number;
  jobPostingsViewed: number;
}

export interface ContentKeywordItem {
  keyword: string;
  count: number;
}

export interface ContentKeywords {
  keywords: ContentKeywordItem[];
  interestTagMatchRate: number;
}

export interface QuestionCategory {
  total: number;
  resolved: number;
  keywords: string[];
}

export interface QuestionAnalysis {
  tech: QuestionCategory;
  career: QuestionCategory;
}

export interface JobTechStack {
  tech: string;
  count: number;
}

export type HighlightType = "success" | "info" | "warning";

export interface Highlight {
  type: HighlightType;
  title: string;
  description: string;
}

export interface TopTag {
  tag: string;
  count: number;
}

/** 이번 주 활동 요약 — GET /reports/weekly 응답의 activities 항목 */
export interface WeeklyActivity {
  contentsRead: number;
  questionsCreated: number;
  jobPostingsViewed: number;
  prevWeekComparison: PrevWeekComparisonDeltas | null;
  topTags: TopTag[] | null;
  contentKeywords: ContentKeywords;
  questionAnalysis: QuestionAnalysis;
  jobTechStacks: JobTechStack[];
  highlights: Highlight[];
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

/** 차트 데이터 */
export interface ChartData {
  dailyActivities: DailyActivity[];
  tagActivities: TagActivity[];
}

/** 주간 리포트 DTO — GET /reports/weekly, /reports/weekly/{reportId} 공통 응답 */
export interface WeeklyReport {
  reportId: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  isShared: boolean;
  activities: WeeklyActivity[];
  chartData: ChartData;
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

export type ReportExportFormat = "pdf";

export interface ReportExportOptions {
  format: ReportExportFormat;
  reportId: string;
}
