"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle, Info, AlertTriangle } from "lucide-react";

import type {
  WeeklyActivity,
  ChartData,
  Highlight,
  HighlightType,
  TagActivity,
  JobTechStack,
} from "@/types/report";
import { formatPrevWeekComparison } from "@/lib/report/formatPrevWeekComparison";
import { cn } from "@/lib/utils";

interface Props {
  activity: WeeklyActivity;
  chartData: ChartData;
}

export default function ReportContent({ activity, chartData }: Props) {
  const { primary: prevWeekPrimary, trend: prevWeekTrend } = formatPrevWeekComparison(
    {
      contentsRead: activity.contentsRead,
      questionsCreated: activity.questionsCreated,
      jobPostingsViewed: activity.jobPostingsViewed,
    },
    activity.prevWeekComparison,
  );

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
          <StatCard label="읽은 글" value={activity.contentsRead} unit="개" />
          <StatCard label="질문" value={activity.questionsCreated} unit="개" />
          <StatCard label="확인 공고" value={activity.jobPostingsViewed} unit="개" />
          <div className="flex flex-col justify-between gap-2 rounded-xl border border-primary/10 bg-card/90 p-4 shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--report-wash)_80%,transparent)] @md:p-5 dark:bg-card/80 dark:shadow-none">
            <p className="text-xs font-medium text-muted-foreground @md:text-sm">전주 대비</p>
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
      </section>

      {/* 섹션 2: 활동 분석 — 요일별 바 차트 (full-width) */}
      <section className="space-y-5 rounded-2xl border border-primary/10 bg-gradient-to-b from-muted/40 to-card p-6 shadow-sm @md:space-y-6 @md:p-8 dark:from-muted/25 dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Analytics
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            이번 주 활동 분석
          </h2>
        </div>

        <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-6 dark:bg-card/80">
          <p className="mb-4 text-sm font-semibold text-report-ink @md:mb-5">요일별 활동량</p>
          <ResponsiveContainer width="100%" height={220}>
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
              <Bar dataKey="count" fill="var(--chart-1)" fillOpacity={0.92} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3개 분석 카드 */}
        <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3 @lg:gap-5">
          <ContentAnalysisCard
            tagActivities={chartData.tagActivities}
            interestTagMatchRate={activity.contentKeywords?.interestTagMatchRate ?? 0}
          />
          <QuestionAnalysisCard analysis={activity.questionAnalysis} />
          <JobAnalysisCard jobTechStacks={activity.jobTechStacks} />
        </div>
      </section>

      {/* 섹션 3: 이번 주 하이라이트 */}
      <section className="space-y-5 rounded-2xl border border-primary/10 bg-gradient-to-b from-[color-mix(in_srgb,var(--report-wash)_24%,var(--card))] to-card p-6 shadow-sm @md:space-y-6 @md:p-8 dark:from-primary/[0.06] dark:to-card">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary/90">
            Highlights
          </p>
          <h2 className="text-balance text-xl font-bold tracking-tight text-report-ink @md:text-[1.35rem]">
            이번 주 하이라이트
          </h2>
        </div>
        {!activity.highlights || activity.highlights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/20 bg-card/80 p-8 text-center text-sm font-medium leading-relaxed text-muted-foreground @md:p-10">
            하이라이트를 준비 중입니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 @md:gap-5">
            {activity.highlights.map((highlight, i) => (
              <HighlightCard key={i} highlight={highlight} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ── 내부 컴포넌트 ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:gap-3 @md:p-5 dark:bg-card/70 dark:shadow-none">
      <p className="text-xs font-medium leading-snug text-muted-foreground @md:text-sm">{label}</p>
      <p className="text-xl font-bold tabular-nums tracking-tight text-report-ink @md:text-2xl dark:text-foreground">
        {value}
        <span className="ms-1 text-xs font-semibold text-muted-foreground @md:text-sm">{unit}</span>
      </p>
    </div>
  );
}

// ── 읽은 글 분석 카드 ──────────────────────────────────────────────────────────

interface ContentAnalysisCardProps {
  tagActivities: TagActivity[];
  interestTagMatchRate: number;
}

function ContentAnalysisCard({ tagActivities, interestTagMatchRate }: ContentAnalysisCardProps) {
  const total = tagActivities.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-5 dark:bg-card/80">
      <p className="mb-4 text-sm font-semibold text-report-ink">읽은 글 분석</p>
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">이번 주 읽은 글이 없어요.</p>
      ) : (
        <div className="space-y-2.5">
          {tagActivities.map((tag) => {
            const pct = total > 0 ? Math.round((tag.count / total) * 100) : 0;
            return (
              <div key={tag.tagName}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-report-ink">{tag.tagName}</span>
                  <span className="tabular-nums text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="mt-3 border-t border-primary/10 pt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">내 관심태그 매칭률</span>
              <span className="font-semibold tabular-nums text-primary">{interestTagMatchRate}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${interestTagMatchRate}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 질문 분석 카드 ─────────────────────────────────────────────────────────────

interface QuestionAnalysisCardProps {
  analysis: WeeklyActivity["questionAnalysis"];
}

function QuestionAnalysisCard({ analysis }: QuestionAnalysisCardProps) {
  return (
    <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-5 dark:bg-card/80">
      <p className="mb-4 text-sm font-semibold text-report-ink">질문 분석</p>

      {/* 수치 행 */}
      <div className="space-y-2">
        <QuestionCountRow label="기술 질문" total={analysis.tech.total} resolved={analysis.tech.resolved} />
        <QuestionCountRow label="커리어 질문" total={analysis.career.total} resolved={analysis.career.resolved} />
      </div>

      <div className="my-3 border-t border-primary/10" />

      {/* 키워드 */}
      <div className="space-y-2.5">
        <QuestionKeywordRow label="기술 질문 키워드" keywords={analysis.tech.keywords} />
        <QuestionKeywordRow label="커리어 질문 키워드" keywords={analysis.career.keywords} />
      </div>
    </div>
  );
}

function QuestionCountRow({ label, total, resolved }: { label: string; total: number; resolved: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-xs tabular-nums text-report-ink">
        <span className="font-semibold">{total}</span>개
        <span className="mx-1.5 text-muted-foreground/50">|</span>
        <span className="text-muted-foreground">채택 </span>
        <span className="font-semibold">{resolved}</span>개
      </span>
    </div>
  );
}

function QuestionKeywordRow({ label, keywords }: { label: string; keywords: string[] }) {
  if (keywords.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="inline-block rounded-md bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 확인 공고 분석 카드 ────────────────────────────────────────────────────────

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface JobAnalysisCardProps {
  jobTechStacks: JobTechStack[];
}

function JobAnalysisCard({ jobTechStacks }: JobAnalysisCardProps) {
  const hasData = jobTechStacks && jobTechStacks.length > 0;

  return (
    <div className="rounded-xl border border-primary/10 bg-card/95 p-4 shadow-sm @md:p-5 dark:bg-card/80">
      <p className="mb-4 text-sm font-semibold text-report-ink">확인 공고 분석</p>
      {!hasData ? (
        <p className="text-sm text-muted-foreground">이번 주 확인한 공고가 없어요.</p>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={jobTechStacks}
                dataKey="count"
                nameKey="tech"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={60}
                paddingAngle={2}
              >
                {jobTechStacks.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  fontSize: 12,
                  border: "1px solid color-mix(in srgb, var(--report-ink) 12%, transparent)",
                }}
                formatter={(value, name) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {jobTechStacks.map((item, i) => {
              const total = jobTechStacks.reduce((s, t) => s + t.count, 0);
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.tech} className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {item.tech} {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 하이라이트 카드 ────────────────────────────────────────────────────────────

const HIGHLIGHT_STYLES: Record<
  HighlightType,
  { bg: string; iconColor: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  success: {
    bg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-500",
    Icon: CheckCircle,
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
    Icon: Info,
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    iconColor: "text-yellow-500",
    Icon: AlertTriangle,
  },
};

interface HighlightCardProps {
  highlight: Highlight;
}

function HighlightCard({ highlight }: HighlightCardProps) {
  const style = HIGHLIGHT_STYLES[highlight.type];
  const { Icon } = style;

  return (
    <article
      className={cn(
        "flex items-start gap-3.5 rounded-xl p-4 shadow-sm @md:gap-4 @md:p-5",
        style.bg,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconColor)} />
      <div className="min-w-0 space-y-1">
        <h3 className="text-[15px] font-semibold leading-snug text-report-ink">
          {highlight.title}
        </h3>
        <p className="text-pretty text-sm font-medium leading-relaxed text-muted-foreground">
          {highlight.description}
        </p>
      </div>
    </article>
  );
}
