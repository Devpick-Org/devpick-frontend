"use client";

import { type ElementType } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  BookOpen,
  HelpCircle,
  Bookmark,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import type { WeeklyActivity, ChartData, AiInsight } from "@/types/report";
import { formatPrevWeekComparison } from "@/lib/report/formatPrevWeekComparison";
import { parseReportTopTags } from "@/lib/report/parseTopTags";
import { cn } from "@/lib/utils";

interface Props {
  activity: WeeklyActivity;
  chartData: ChartData;
  aiInsight: AiInsight | null;
}

export default function ReportContent({
  activity,
  chartData,
  aiInsight,
}: Props) {
  const topTags = parseReportTopTags(activity.topTags);

  const { primary: prevWeekPrimary, trend: prevWeekTrend } =
    formatPrevWeekComparison(activity.prevWeekComparison);

  return (
    <div className="@container space-y-10">
      {/* 섹션 1: 이번 주 활동 요약 */}
      <section className="space-y-6 rounded-2xl border border-primary/10 bg-gradient-to-b from-[color-mix(in_srgb,var(--report-wash)_28%,var(--card))] to-card p-6 shadow-sm @md:p-8 dark:from-primary/[0.07] dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Summary
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            이번 주 활동 요약
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 @sm:grid-cols-4 @sm:gap-4">
          <StatCard
            icon={BookOpen}
            label="읽은 글"
            value={activity.contentsRead}
            unit="개"
            accentClass="text-primary"
            iconBgClass="bg-primary/10"
          />
          <StatCard
            icon={HelpCircle}
            label="질문"
            value={activity.questionsCreated}
            unit="개"
            accentClass="text-primary"
            iconBgClass="bg-primary/10"
          />
          <StatCard
            icon={Bookmark}
            label="스크랩"
            value={activity.scrapsCount}
            unit="개"
            accentClass="text-primary"
            iconBgClass="bg-primary/10"
          />
          <div className="flex flex-col justify-between rounded-xl border border-primary/10 bg-card/90 p-4 shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--report-wash)_80%,transparent)] dark:bg-card/80 dark:shadow-none">
            <div className="mb-2 flex items-center gap-2 font-medium text-muted-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm">전주 대비</span>
            </div>
            <p
              className={cn(
                "text-balance text-base font-semibold leading-snug @md:text-lg ms-2 pe-1",
                prevWeekTrend === "up" && "text-green-600",
                prevWeekTrend === "down" && "text-red-500",
                prevWeekTrend === "flat" && "text-muted-foreground",
              )}
            >
              {prevWeekPrimary}
            </p>
          </div>
        </div>

        {topTags.length > 0 && (
          <div className="rounded-xl border border-primary/10 bg-[color-mix(in_srgb,var(--report-wash)_18%,var(--card))] p-4 @md:p-5 dark:bg-primary/[0.05]">
            <p className="mb-3 text-sm font-semibold text-report-ink">
              많이 본 태그 TOP3
            </p>
            <div className="flex flex-wrap gap-2">
              {topTags.slice(0, 3).map((tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                >
                  <span className="text-xs font-semibold text-primary/70">
                    #{i + 1}
                  </span>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 섹션 2: 차트 */}
      <section className="space-y-6 rounded-2xl border border-primary/10 bg-gradient-to-b from-muted/40 to-card p-6 shadow-sm @md:p-8 dark:from-muted/25 dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Analytics
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            활동 분석
          </h2>
        </div>
        <div className="grid gap-5 @md:grid-cols-2 @md:gap-6">
          <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-5 dark:bg-card/80">
            <p className="mb-4 text-sm font-semibold text-report-ink">
              요일별 활동량
            </p>
            <ResponsiveContainer width="100%" height={192}>
              <BarChart
                data={chartData.dailyActivities}
                margin={{ top: 6, right: 4, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 6"
                  vertical={false}
                  stroke="color-mix(in srgb, var(--report-ink) 9%, transparent)"
                />
                <XAxis
                  dataKey="dayOfWeek"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) =>
                    ({ MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일" }[v] ?? v)
                  }
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    fontSize: 12,
                    border: "1px solid color-mix(in srgb, var(--report-ink) 12%, transparent)",
                    boxShadow: "0 4px 20px color-mix(in srgb, var(--report-ink) 8%, transparent)",
                  }}
                  formatter={(value) => [value, "활동"]}
                  cursor={{ fill: "color-mix(in srgb, var(--primary) 8%, transparent)" }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  fillOpacity={0.92}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-5 dark:bg-card/80">
            <p className="mb-4 text-sm font-semibold text-report-ink">
              태그별 활동
            </p>
            <ResponsiveContainer width="100%" height={192}>
              <RadarChart data={chartData.tagActivities}>
                <PolarGrid
                  stroke="color-mix(in srgb, var(--report-ink) 12%, transparent)"
                  strokeDasharray="4 6"
                />
                <PolarAngleAxis
                  dataKey="tagName"
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                    fontWeight: 600,
                  }}
                />
                <Radar
                  dataKey="count"
                  fill="var(--chart-1)"
                  fillOpacity={0.22}
                  stroke="var(--chart-1)"
                  strokeWidth={1.25}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    fontSize: 12,
                    border: "1px solid color-mix(in srgb, var(--report-ink) 12%, transparent)",
                  }}
                  formatter={(value) => [value, "활동"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 섹션 3: AI 인사이트 */}
      <section className="space-y-6 rounded-2xl border border-primary/10 bg-gradient-to-b from-[color-mix(in_srgb,var(--report-wash)_24%,var(--card))] to-card p-6 shadow-sm @md:p-8 dark:from-primary/[0.06] dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Insights
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            AI 인사이트
          </h2>
        </div>
        {aiInsight === null ||
        (!aiInsight.wellDone && !aiInsight.lacking && !aiInsight.nextWeek) ? (
          <div className="rounded-xl border border-dashed border-primary/20 bg-card/80 p-8 text-center text-sm font-medium leading-relaxed text-muted-foreground">
            AI 인사이트를 준비 중입니다.
          </div>
        ) : (
          <div className="space-y-3">
            {aiInsight.wellDone && (
              <InsightCard
                icon={Lightbulb}
                iconClass="text-yellow-500"
                title="이번 주 잘한 것"
                content={aiInsight.wellDone}
              />
            )}
            {aiInsight.lacking && (
              <InsightCard
                icon={AlertCircle}
                iconClass="text-orange-400"
                title="부족했던 부분"
                content={aiInsight.lacking}
              />
            )}
            {aiInsight.nextWeek && (
              <InsightCard
                icon={ArrowRight}
                iconClass="text-primary"
                title="다음 주 추천 방향"
                content={aiInsight.nextWeek}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ── 내부 컴포넌트 ─────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: ElementType;
  label: string;
  value: number;
  unit: string;
  accentClass: string;
  iconBgClass: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  accentClass,
  iconBgClass,
}: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-primary/10 bg-card/95 p-3 shadow-sm @md:p-4 dark:bg-card/70 dark:shadow-none">
      <div className="mb-2 flex items-center gap-2 font-medium text-muted-foreground">
        <span
          className={cn(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full @md:h-8 @md:w-8",
            iconBgClass,
          )}
        >
          <Icon className={cn("h-3.5 w-3.5 @md:h-4 @md:w-4", accentClass)} />
        </span>
        <span className="truncate text-xs @md:text-sm">{label}</span>
      </div>
      <p className="ms-0.5 text-xl font-bold tabular-nums tracking-tight text-report-ink @md:ms-1 @md:text-2xl dark:text-foreground">
        {value}
        <span className="ms-1 text-xs font-semibold text-muted-foreground @md:text-sm">
          {unit}
        </span>
      </p>
    </div>
  );
}

interface InsightCardProps {
  icon: ElementType;
  iconClass: string;
  title: string;
  content: string;
}

function InsightCard({
  icon: Icon,
  iconClass,
  title,
  content,
}: InsightCardProps) {
  return (
    <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-5 dark:bg-card/75 dark:shadow-none">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Icon className={cn("h-4 w-4", iconClass)} />
        </span>
        <p className="text-[15px] font-semibold text-report-ink">
          {title}
        </p>
      </div>
      <p className="ps-0.5 text-pretty text-sm font-medium leading-relaxed text-muted-foreground @md:ps-11">
        {content}
      </p>
    </div>
  );
}
