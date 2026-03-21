"use client";

import WeeklyReportPage from "./WeeklyReportPage";

export default function ReportTabsPage() {
  return (
    <div className="w-full px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">리포트</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground mb-6">
          주간 학습 패턴과 성장 흐름을 한눈에 확인하세요.
        </p>
        <WeeklyReportPage />
      </div>
    </div>
  );
}
