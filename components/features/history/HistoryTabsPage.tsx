"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HistoryPage from "./HistoryPage";
import ActivityPage from "./ActivityPage";

const TRIGGER_CLASS =
  "rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-semibold " +
  "text-muted-foreground transition-colors " +
  "data-[state=active]:border-primary data-[state=active]:text-foreground " +
  "data-[state=active]:bg-transparent data-[state=active]:shadow-none " +
  "hover:text-foreground";

export default function HistoryTabsPage() {
  return (
    <div className="w-full px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
          히스토리
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground mb-6">
          나의 학습 기록과 활동 내역을 한눈에 확인하세요.
        </p>
        <Tabs defaultValue="learning">
          <TabsList className="mb-8 w-full border-b border-border bg-transparent rounded-none p-0 h-auto justify-start gap-0">
            <TabsTrigger value="learning" className={TRIGGER_CLASS}>
              학습
            </TabsTrigger>
            <TabsTrigger value="activity" className={TRIGGER_CLASS}>
              활동
            </TabsTrigger>
          </TabsList>
          <TabsContent value="learning">
            <HistoryPage />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
