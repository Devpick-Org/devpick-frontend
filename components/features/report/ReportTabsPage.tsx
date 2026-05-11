"use client";

import WeeklyReportPage from "./WeeklyReportPage";

export default function ReportTabsPage() {
  return (
    <div className="min-h-screen w-full bg-muted/45 dark:bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 @container md:px-6 md:py-10 lg:max-w-[1200px] lg:px-8 lg:py-12">
        <WeeklyReportPage />
      </div>
    </div>
  );
}
