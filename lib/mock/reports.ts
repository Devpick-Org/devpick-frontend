import type {
  WeeklyReport,
  WeeklyReportSummary,
  WeeklyReportResponse,
  WeeklyReportByIdResponse,
  WeeklyReportListResponse,
  WeeklyShareCreateResponse,
  WeeklySharedReportResponse,
  ReportExportOptions,
} from "@/types/report";

// ── 기본 mock 데이터 ──────────────────────────────────────────────────────────
// TODO: 실제 API 연동 시 chartData / aiInsight는 API 응답으로 교체 예정

const MOCK_WEEKLY_REPORTS: WeeklyReport[] = [
  {
    reportId: "836df459-dc40-4aa1-972a-6eb0a864dff9",
    weekStart: "2026-03-14",
    weekEnd: "2026-03-20",
    status: "COMPLETED",
    isShared: false,
    activities: [
      {
        contentsRead: 12,
        questionsCreated: 3,
        scrapsCount: 5,
        topTags: "React,Next.js,TypeScript",
        prevWeekComparison: "+20%",
      },
    ],
    // TODO: 실제 API 연동 시 교체 예정
    chartData: {
      dailyActivities: [
        { dayOfWeek: "MON", count: 2 },
        { dayOfWeek: "TUE", count: 5 },
        { dayOfWeek: "WED", count: 3 },
        { dayOfWeek: "THU", count: 7 },
        { dayOfWeek: "FRI", count: 4 },
        { dayOfWeek: "SAT", count: 1 },
        { dayOfWeek: "SUN", count: 0 },
      ],
      tagActivities: [
        { tagName: "React", count: 90 },
        { tagName: "Next.js", count: 70 },
        { tagName: "TypeScript", count: 60 },
        { tagName: "CSS", count: 40 },
        { tagName: "Node.js", count: 20 },
      ],
    },
    // TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
    aiInsight: null,
  },
  {
    reportId: "7a2b4c6d-8e9f-4a1b-b2c3-d4e5f6a7b8c9",
    weekStart: "2026-03-07",
    weekEnd: "2026-03-13",
    status: "COMPLETED",
    isShared: false,
    activities: [
      {
        contentsRead: 10,
        questionsCreated: 2,
        scrapsCount: 4,
        topTags: "TypeScript,JavaScript,Node.js",
        prevWeekComparison: "+5%",
      },
    ],
    // TODO: 실제 API 연동 시 교체 예정
    chartData: {
      dailyActivities: [
        { dayOfWeek: "MON", count: 3 },
        { dayOfWeek: "TUE", count: 4 },
        { dayOfWeek: "WED", count: 2 },
        { dayOfWeek: "THU", count: 5 },
        { dayOfWeek: "FRI", count: 3 },
        { dayOfWeek: "SAT", count: 2 },
        { dayOfWeek: "SUN", count: 1 },
      ],
      tagActivities: [
        { tagName: "TypeScript", count: 80 },
        { tagName: "JavaScript", count: 65 },
        { tagName: "Node.js", count: 50 },
        { tagName: "React", count: 30 },
        { tagName: "SQL", count: 15 },
      ],
    },
    // TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
    aiInsight: null,
  },
  {
    reportId: "1f2e3d4c-5b6a-7890-abcd-ef1234567890",
    weekStart: "2026-02-28",
    weekEnd: "2026-03-06",
    status: "COMPLETED",
    isShared: false,
    activities: [
      {
        contentsRead: 7,
        questionsCreated: 1,
        scrapsCount: 3,
        topTags: "Docker,CI/CD,Linux",
        prevWeekComparison: "-15%",
      },
    ],
    // TODO: 실제 API 연동 시 교체 예정
    chartData: {
      dailyActivities: [
        { dayOfWeek: "MON", count: 1 },
        { dayOfWeek: "TUE", count: 2 },
        { dayOfWeek: "WED", count: 1 },
        { dayOfWeek: "THU", count: 3 },
        { dayOfWeek: "FRI", count: 2 },
        { dayOfWeek: "SAT", count: 0 },
        { dayOfWeek: "SUN", count: 0 },
      ],
      tagActivities: [
        { tagName: "Docker", count: 70 },
        { tagName: "CI/CD", count: 55 },
        { tagName: "Linux", count: 45 },
        { tagName: "AWS", count: 30 },
        { tagName: "Nginx", count: 20 },
      ],
    },
    // TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
    aiInsight: null,
  },
  {
    reportId: "abcdef12-3456-7890-abcd-ef1234567890",
    weekStart: "2026-02-21",
    weekEnd: "2026-02-27",
    status: "COMPLETED",
    isShared: false,
    activities: [
      {
        contentsRead: 8,
        questionsCreated: 2,
        scrapsCount: 2,
        topTags: "Spring,Java,Backend",
        prevWeekComparison: "+8%",
      },
    ],
    // TODO: 실제 API 연동 시 교체 예정
    chartData: {
      dailyActivities: [
        { dayOfWeek: "MON", count: 2 },
        { dayOfWeek: "TUE", count: 3 },
        { dayOfWeek: "WED", count: 1 },
        { dayOfWeek: "THU", count: 4 },
        { dayOfWeek: "FRI", count: 2 },
        { dayOfWeek: "SAT", count: 1 },
        { dayOfWeek: "SUN", count: 0 },
      ],
      tagActivities: [
        { tagName: "Spring", count: 85 },
        { tagName: "Java", count: 75 },
        { tagName: "Backend", count: 60 },
        { tagName: "JPA", count: 40 },
        { tagName: "MySQL", count: 25 },
      ],
    },
    // TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
    aiInsight: null,
  },
];

// 공유 토큰 임시 저장소 (mock 전용, 메모리 기반)
// [Mock 한계] _shareStore는 서버 프로세스 메모리에만 존재합니다.
// 새 창/새로고침에서는 토큰이 사라져 getWeeklyReportByShareToken이 reject됩니다.
// 실제 API 연동 시 이 동작은 서버 측 토큰 검증으로 대체되므로 별도 우회 처리 없이 구조를 유지합니다.
const _shareStore: Record<string, string> = {};

// ── mock 함수들 ────────────────────────────────────────────────────────────────

export function mockGetWeeklyReport(): Promise<WeeklyReportResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { ...MOCK_WEEKLY_REPORTS[0] },
        message: "주간 리포트를 불러왔습니다",
      });
    }, 600);
  });
}

export function mockGetWeeklyReportById(
  reportId: string,
): Promise<WeeklyReportByIdResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const report = MOCK_WEEKLY_REPORTS.find((r) => r.reportId === reportId);
      if (report) {
        resolve({
          success: true,
          data: { ...report },
          message: "주간 리포트를 불러왔습니다",
        });
      } else {
        reject(new Error("해당 리포트를 찾을 수 없습니다"));
      }
    }, 400);
  });
}

// TODO: 실제 API 연동 시 교체 예정 — 현재 mock 기반으로 주간 리포트 목록 반환
export function mockGetWeeklyReportList(): Promise<WeeklyReportListResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list: WeeklyReportSummary[] = MOCK_WEEKLY_REPORTS.map(
        ({ reportId, weekStart, weekEnd, status }) => ({
          reportId,
          weekStart,
          weekEnd,
          status,
        }),
      );
      resolve({
        success: true,
        data: list,
        message: "주간 리포트 목록을 불러왔습니다",
      });
    }, 300);
  });
}

export function mockCreateWeeklyReportShare(
  reportId: string,
): Promise<WeeklyShareCreateResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = `share-${reportId}-${Date.now()}`;
      _shareStore[token] = reportId;
      resolve({
        success: true,
        data: { reportId, shareToken: token },
        message: "공유 링크가 생성되었습니다",
      });
    }, 500);
  });
}

export function mockGetWeeklyReportByShareToken(
  token: string,
): Promise<WeeklySharedReportResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reportId = _shareStore[token];
      if (!reportId) {
        reject(new Error("유효하지 않거나 만료된 공유 링크입니다"));
        return;
      }
      const report =
        MOCK_WEEKLY_REPORTS.find((r) => r.reportId === reportId) ??
        MOCK_WEEKLY_REPORTS[0];
      resolve({
        success: true,
        data: { ...report },
        message: "공유된 주간 리포트를 불러왔습니다",
      });
    }, 400);
  });
}

/**
 * PDF export stub — 현재 미사용
 * 실제 PDF 저장은 lib/report/exportPdf.ts의 exportReportAsPdf()로 처리됩니다.
 * WeeklyReportPage의 exportMutation에서 직접 호출합니다.
 */
export async function mockExportWeeklyReport(
  options: ReportExportOptions,
): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  console.log(
    `[Export stub] format=${options.format}, reportId=${options.reportId}`,
  );
}
