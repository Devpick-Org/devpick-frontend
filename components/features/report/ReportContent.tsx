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

import type {
  WeeklyActivity,
  ChartData,
  Highlight,
  HighlightType,
  TagActivity,
  JobTechStack,
} from "@/types/report";
import {
  formatPrevWeekComparison,
  parsePrevWeekComparisonRaw,
  type PrevWeekTrend,
} from "@/lib/report/formatPrevWeekComparison";
import { cn } from "@/lib/utils";

export type ReportContentVariant = "default" | "print";

interface Props {
  activity: WeeklyActivity;
  chartData: ChartData;
  /** `print`: PDF용 단일 열, 사이드바 생략 */
  variant?: ReportContentVariant;
}

export default function ReportContent({
  activity,
  chartData,
  variant = "default",
}: Props) {
  const { primary: prevWeekPrimary, trend: prevWeekTrend } = formatPrevWeekComparison(
    {
      contentsRead: activity.contentsRead,
      questionsCreated: activity.questionsCreated,
      jobPostingsViewed: activity.jobPostingsViewed,
    },
    activity.prevWeekComparison,
  );
  const prevWeek = parsePrevWeekComparisonRaw(activity.prevWeekComparison);

  const isPrint = variant === "print";

  const summaryBlock = (
    <DashboardCard>
      <SectionHeader kicker="Summary" title="이번 주 활동 요약" />
      <div className="space-y-4 @sm:space-y-5">
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-3 @sm:gap-5">
          <StatCard label="읽은 글" value={activity.contentsRead} unit="개" />
          <StatCard label="질문" value={activity.questionsCreated} unit="개" />
          <StatCard label="확인 공고" value={activity.jobPostingsViewed} unit="개" />
        </div>
        <PrevWeekComparisonCard
          activity={activity}
          previous={prevWeek}
          primary={prevWeekPrimary}
          trend={prevWeekTrend}
        />
      </div>
    </DashboardCard>
  );

  const analyticsBlock = (
    <DashboardCard>
      <SectionHeader kicker="Analytics" title="이번 주 활동 분석" />
      <div className="mb-8 rounded-xl border border-border/60 bg-card p-4 shadow-inner @md:p-6 dark:border-border/40">
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

      <div className="grid grid-cols-1 gap-5 @lg:grid-cols-3 @lg:gap-6">
        <ContentAnalysisCard
          tagActivities={chartData.tagActivities}
          interestTagMatchRate={activity.contentKeywords?.interestTagMatchRate ?? 0}
        />
        <QuestionAnalysisCard analysis={activity.questionAnalysis} />
        <JobAnalysisCard jobTechStacks={activity.jobTechStacks ?? []} />
      </div>
    </DashboardCard>
  );

  const highlightsBlock = (
    <DashboardCard id="report-highlights">
      <SectionHeader kicker="Insights" title="이번 주 하이라이트" />
      {!activity.highlights || activity.highlights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-sm font-medium leading-relaxed text-muted-foreground @md:p-10 dark:border-border/50">
          이번 주 하이라이트를 분석 중이에요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 @md:gap-6">
          {activity.highlights.map((highlight, i) => (
            <HighlightCard key={i} highlight={highlight} />
          ))}
        </div>
      )}
    </DashboardCard>
  );

  if (isPrint) {
    return (
      <div className="space-y-8">
        {summaryBlock}
        {analyticsBlock}
        {highlightsBlock}
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start lg:gap-10">
        <div className="space-y-10 lg:col-span-2">
          {summaryBlock}
          {analyticsBlock}
          {highlightsBlock}
        </div>

        <aside className="space-y-6 lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
          <ReportSidebar
            activity={activity}
            prevWeek={prevWeek}
            prevWeekPrimary={prevWeekPrimary}
            prevWeekTrend={prevWeekTrend}
          />
        </aside>
      </div>
    </div>
  );
}

// ── 레이아웃 프리미티브 ─────────────────────────────────────────────────────────

function DashboardCard({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-xl border border-border/80 bg-card p-6 shadow-sm @md:p-8 dark:border-border/60",
        className,
      )}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  kicker,
  title,
  action,
}: {
  kicker: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-1 @sm:mb-8 @md:flex-row @md:items-end @md:justify-between">
      <div className="space-y-1">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
          {kicker}
        </p>
        <h2 className="text-balance text-xl font-semibold tracking-tight text-report-ink @md:text-2xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

// ── 사이드바 ───────────────────────────────────────────────────────────────────

function ReportSidebar({
  activity,
  prevWeek,
  prevWeekPrimary,
  prevWeekTrend,
}: {
  activity: WeeklyActivity;
  prevWeek: ReturnType<typeof parsePrevWeekComparisonRaw>;
  prevWeekPrimary: string;
  prevWeekTrend: PrevWeekTrend;
}) {
  const highlights = activity.highlights ?? [];
  const showViewAll = highlights.length > 3;

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 @md:p-6">
        <div className="mb-5 space-y-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
            Snapshot
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-report-ink">이번 주 스냅샷</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <MiniStat label="읽은 글" value={activity.contentsRead} suffix="개" />
          <MiniStat label="질문" value={activity.questionsCreated} suffix="개" />
          <MiniStat label="확인 공고" value={activity.jobPostingsViewed} suffix="개" />
        </div>
      </DashboardCard>

      <PrevWeekComparisonCard
        activity={activity}
        previous={prevWeek}
        primary={prevWeekPrimary}
        trend={prevWeekTrend}
        compact
      />

      <DashboardCard className="p-5 @md:p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-report-ink">하이라이트 요약</h3>
          {showViewAll ? (
            <a
              href="#report-highlights"
              className="shrink-0 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              전체 보기
            </a>
          ) : null}
        </div>
        {highlights.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 표시할 인사이트가 없어요.</p>
        ) : (
          <ul className="space-y-2.5">
            {highlights.slice(0, 3).map((h, i) => (
              <li
                key={i}
                className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5 text-sm leading-snug dark:border-border/50 dark:bg-muted/10"
              >
                <span className="block font-medium text-report-ink">{h.title}</span>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}

type PrevWeekMetric = {
  key: string;
  label: string;
  current: number;
  previous: number;
};

function formatDelta(delta: number): string {
  if (delta === 0) return "변화 없음";
  return delta > 0 ? `${delta}개 증가` : `${Math.abs(delta)}개 감소`;
}

function PrevWeekComparisonCard({
  activity,
  previous,
  primary,
  trend,
  compact = false,
}: {
  activity: WeeklyActivity;
  previous: ReturnType<typeof parsePrevWeekComparisonRaw>;
  primary: string;
  trend: PrevWeekTrend;
  compact?: boolean;
}) {
  const metrics: PrevWeekMetric[] | null = previous
    ? [
        {
          key: "contents",
          label: "읽은 글",
          current: activity.contentsRead,
          previous: previous.contentsRead,
        },
        {
          key: "questions",
          label: "질문",
          current: activity.questionsCreated,
          previous: previous.questionsCreated,
        },
        {
          key: "jobs",
          label: "확인 공고",
          current: activity.jobPostingsViewed,
          previous: previous.jobPostingsViewed,
        },
      ]
    : null;

  const totalDelta =
    metrics?.reduce((sum, metric) => sum + (metric.current - metric.previous), 0) ?? 0;
  const changedMetrics = metrics?.filter((metric) => metric.current !== metric.previous) ?? [];
  const headline =
    !previous
      ? "비교 데이터 준비 중"
      : totalDelta === 0
        ? "지난주와 비슷한 흐름이에요"
        : totalDelta > 0
          ? "지난주보다 활동이 늘었어요"
          : "지난주보다 활동이 줄었어요";
  const detail =
    !previous
      ? primary === "-" ? "다음 리포트부터 전주 흐름을 비교해 보여드릴게요." : primary
      : changedMetrics.length === 0
        ? "읽은 글, 질문, 확인 공고 모두 큰 변화가 없어요."
        : changedMetrics
            .map((metric) => `${metric.label} ${formatDelta(metric.current - metric.previous)}`)
            .join(" · ");

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 shadow-sm dark:border-border/60",
        compact ? "@md:p-5" : "@md:p-5",
      )}
    >
      <div className="mb-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground @md:text-sm">전주 대비</p>
        <p
          className={cn(
            "text-base font-semibold leading-snug text-report-ink dark:text-foreground",
            trend === "up" && "text-green-700 dark:text-green-400",
            trend === "down" && "text-amber-700 dark:text-amber-300",
          )}
        >
          {headline}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </div>

      {metrics ? (
        <div className="space-y-2">
          {metrics.map((metric) => {
            const delta = metric.current - metric.previous;
            return (
              <div
                key={metric.key}
                className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-xs dark:bg-muted/15"
              >
                <span className="font-medium text-muted-foreground">{metric.label}</span>
                <span className="tabular-nums text-report-ink dark:text-foreground">
                  {metric.previous} → {metric.current}
                  <span
                    className={cn(
                      "ms-2 font-semibold",
                      delta > 0 && "text-green-600 dark:text-green-500",
                      delta < 0 && "text-amber-700 dark:text-amber-300",
                      delta === 0 && "text-muted-foreground",
                    )}
                  >
                    {formatDelta(delta)}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 dark:border-border/40 dark:bg-muted/15">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="tabular-nums text-sm font-semibold text-report-ink dark:text-foreground">
        {value}
        <span className="ms-0.5 text-xs font-medium text-muted-foreground">{suffix}</span>
      </span>
    </div>
  );
}

// ── 통계 카드 ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl border border-border/80 bg-card p-4 shadow-sm @md:gap-3 @md:p-5 dark:border-border/60">
      <p className="text-xs font-medium leading-snug text-muted-foreground @md:text-sm">{label}</p>
      <p className="text-xl font-bold tabular-nums tracking-tight text-report-ink @md:text-2xl dark:text-foreground">
        {value}
        <span className="ms-1 text-xs font-semibold text-muted-foreground @md:text-sm">{unit}</span>
      </p>
    </div>
  );
}

// ── 읽은 글 분석 카드 ───────────────────────────────────────────────────────────

interface ContentAnalysisCardProps {
  tagActivities: TagActivity[];
  interestTagMatchRate: number;
}

function ContentAnalysisCard({ tagActivities, interestTagMatchRate }: ContentAnalysisCardProps) {
  const total = tagActivities.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm @md:p-5 dark:border-border/60">
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
          <div className="mt-3 border-t border-border/60 pt-3 dark:border-border/50">
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

// ── 질문 분석 카드 ───────────────────────────────────────────────────────────────

interface QuestionAnalysisCardProps {
  analysis: WeeklyActivity["questionAnalysis"];
}

function QuestionAnalysisCard({ analysis }: QuestionAnalysisCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm @md:p-5 dark:border-border/60">
      <p className="mb-4 text-sm font-semibold text-report-ink">질문 분석</p>

      {!analysis ? (
        <p className="text-sm text-muted-foreground">질문 데이터가 없어요.</p>
      ) : (
        <>
          <div className="space-y-2">
            <QuestionCountRow label="기술 질문" total={analysis.tech.total} resolved={analysis.tech.resolved} />
            <QuestionCountRow label="커리어 질문" total={analysis.career.total} resolved={analysis.career.resolved} />
          </div>

          <div className="my-3 border-t border-border/60 dark:border-border/50" />

          <div className="space-y-2.5">
            <QuestionKeywordRow label="기술 질문 키워드" keywords={analysis.tech.keywords} />
            <QuestionKeywordRow label="커리어 질문 키워드" keywords={analysis.career.keywords} />
          </div>
        </>
      )}
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

// ── 확인 공고 분석 카드 ─────────────────────────────────────────────────────────

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
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm @md:p-5 dark:border-border/60">
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

const HIGHLIGHT_THEME: Record<
  HighlightType,
  {
    accent: string;
    title: string;
  }
> = {
  success: {
    accent: "bg-emerald-500/70",
    title: "text-emerald-900 dark:text-emerald-200",
  },
  info: {
    accent: "bg-primary/70",
    title: "text-report-ink dark:text-foreground",
  },
  warning: {
    accent: "bg-amber-500/70",
    title: "text-amber-950 dark:text-amber-200",
  },
};

interface HighlightCardProps {
  highlight: Highlight;
}

function HighlightCard({ highlight }: HighlightCardProps) {
  const tone = HIGHLIGHT_THEME[highlight.type];

  return (
    <article
      className="rounded-xl border border-border/80 bg-card p-4 shadow-sm dark:border-border/60 @md:p-5"
    >
      <div className="flex gap-3">
        <span
          className={cn("mt-1 h-10 w-1 shrink-0 rounded-full", tone.accent)}
          aria-hidden
        />
        <div className="min-w-0 space-y-1.5">
          <h3 className={cn("text-sm font-semibold leading-snug", tone.title)}>
            {highlight.title}
          </h3>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {highlight.description}
          </p>
        </div>
      </div>
    </article>
  );
}
