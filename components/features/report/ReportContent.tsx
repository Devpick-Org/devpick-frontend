"use client";

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
    <div className="@container space-y-8 @md:space-y-10">
      {/* 섹션 1: 이번 주 활동 요약 */}
      <section className="space-y-5 rounded-2xl border border-primary/10 bg-gradient-to-b from-[color-mix(in_srgb,var(--report-wash)_28%,var(--card))] to-card p-6 shadow-sm @md:space-y-6 @md:p-8 dark:from-primary/[0.07] dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Summary
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            이번 주 활동 요약
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 @sm:gap-4 @xl:grid-cols-4 @xl:gap-5">
          <StatCard
            label="읽은 글"
            value={activity.contentsRead}
            unit="개"
          />
          <StatCard
            label="질문"
            value={activity.questionsCreated}
            unit="개"
          />
          <StatCard
            label="스크랩"
            value={activity.scrapsCount}
            unit="개"
          />
          <div className="flex flex-col justify-between gap-2 rounded-xl border border-primary/10 bg-card/90 p-4 shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--report-wash)_80%,transparent)] @md:p-5 dark:bg-card/80 dark:shadow-none">
            <p className="text-xs font-medium text-muted-foreground @md:text-sm">
              전주 대비
            </p>
            <p
              className={cn(
                "text-balance text-base font-semibold leading-snug @md:text-lg",
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
          <div className="rounded-xl border border-primary/10 bg-[color-mix(in_srgb,var(--report-wash)_18%,var(--card))] p-4 @md:p-6 dark:bg-primary/[0.05]">
            <p className="mb-3 text-sm font-semibold text-report-ink @md:mb-4">
              많이 본 태그 TOP3
            </p>
            <div className="flex flex-wrap gap-2 @md:gap-2.5">
              {topTags.slice(0, 3).map((tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-card/90 px-3 py-1.5 text-sm font-medium text-report-ink dark:bg-card/70"
                >
                  <span className="text-[0.6875rem] font-semibold tabular-nums text-primary/75">
                    {i + 1}
                  </span>
                  <span className="text-primary">{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 섹션 2: 차트 */}
      <section className="space-y-5 rounded-2xl border border-primary/10 bg-gradient-to-b from-muted/40 to-card p-6 shadow-sm @md:space-y-6 @md:p-8 dark:from-muted/25 dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Analytics
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            활동 분석
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 @lg:grid-cols-2 @lg:gap-8">
          <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-6 dark:bg-card/80">
            <p className="mb-4 text-sm font-semibold text-report-ink @md:mb-5">
              요일별 활동량
            </p>
            <ResponsiveContainer width="100%" height={204}>
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

          <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-6 dark:bg-card/80">
            <p className="mb-4 text-sm font-semibold text-report-ink @md:mb-5">
              태그별 활동
            </p>
            <ResponsiveContainer width="100%" height={204}>
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
      <section className="space-y-5 rounded-2xl border border-primary/10 bg-gradient-to-b from-[color-mix(in_srgb,var(--report-wash)_24%,var(--card))] to-card p-6 shadow-sm @md:space-y-6 @md:p-8 dark:from-primary/[0.06] dark:to-card">
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
          <div className="rounded-xl border border-dashed border-primary/20 bg-card/80 p-8 text-center text-sm font-medium leading-relaxed text-muted-foreground @md:p-10">
            AI 인사이트를 준비 중입니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 @md:gap-5">
            {aiInsight.wellDone && (
              <InsightCard
                title="이번 주 잘한 것"
                content={aiInsight.wellDone}
              />
            )}
            {aiInsight.lacking && (
              <InsightCard
                title="부족했던 부분"
                content={aiInsight.lacking}
              />
            )}
            {aiInsight.nextWeek && (
              <InsightCard
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
  label: string;
  value: number;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:gap-3 @md:p-5 dark:bg-card/70 dark:shadow-none">
      <p className="text-xs font-medium leading-snug text-muted-foreground @md:text-sm">
        {label}
      </p>
      <p className="text-xl font-bold tabular-nums tracking-tight text-report-ink @md:text-2xl dark:text-foreground">
        {value}
        <span className="ms-1 text-xs font-semibold text-muted-foreground @md:text-sm">
          {unit}
        </span>
      </p>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  content: string;
}

function InsightCard({ title, content }: InsightCardProps) {
  return (
    <article className="rounded-xl border border-primary/10 bg-card/95 p-5 shadow-sm @md:p-6 dark:bg-card/75 dark:shadow-none">
      <h3 className="mb-2 text-[15px] font-semibold leading-snug text-report-ink @md:mb-3">
        {title}
      </h3>
      <p className="text-pretty text-sm font-medium leading-relaxed text-muted-foreground">
        {content}
      </p>
    </article>
  );
}
