"use client";

import { FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklyReportPage from "./WeeklyReportPage";

export default function ReportTabsPage() {
  return (
    <div className="w-full px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground mb-6">리포트</h1>
      <Tabs defaultValue="weekly">
        <TabsList className="mb-6 w-fit">
          <TabsTrigger value="weekly">주간 리포트</TabsTrigger>
          <TabsTrigger value="history">학습 히스토리</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <WeeklyReportPage />
        </TabsContent>
        <TabsContent value="history">
          <HistoryPlaceholder />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

function HistoryPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-foreground">
      <FileText className="w-8 h-8" />
      <p className="text-sm font-medium">학습 히스토리</p>
      <p className="text-xs font-medium">준비 중입니다. (DP-251)</p>
    </div>
  );
}
