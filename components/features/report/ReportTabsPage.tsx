"use client";

import WeeklyReportPage from "./WeeklyReportPage";

export default function ReportTabsPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl @container">
        <header className="mb-8 space-y-3 border-b border-primary/10 pb-8">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
            주간 학습
          </p>
          <h1 className="text-balance font-bold tracking-tight text-2xl text-report-ink leading-tight @md:text-3xl @lg:text-[2rem]">
            리포트
          </h1>
          <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground @md:text-base">
            주간 학습 패턴과 성장 흐름을 한눈에 확인하세요.
          </p>
        </header>
        <WeeklyReportPage />
      </div>
    </div>
  );
}
