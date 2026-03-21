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
import { cn } from "@/lib/utils";

interface Props {
  activity: WeeklyActivity;
  // TODO: 실제 API 연동 시 교체 예정
  chartData: ChartData;
  // TODO: 실제 API 연동 시 교체 예정 — 현재 백엔드도 null 반환
  aiInsight: AiInsight | null;
}

export default function ReportContent({
  activity,
  chartData,
  aiInsight,
}: Props) {
  const topTags = activity.topTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const isPositiveTrend = activity.prevWeekComparison.startsWith("+");
  const isNegativeTrend = activity.prevWeekComparison.startsWith("-");

  return (
    <div className="space-y-8">
      {/* 섹션 1: 이번 주 활동 요약 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">이번 주 활동 요약</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={BookOpen}
            label="읽은 글"
            value={activity.contentsRead}
            unit="개"
            accentClass="text-blue-600"
            iconBgClass="bg-blue-50"
          />
          <StatCard
            icon={HelpCircle}
            label="질문"
            value={activity.questionsCreated}
            unit="개"
            accentClass="text-blue-600"
            iconBgClass="bg-blue-50"
          />
          <StatCard
            icon={Bookmark}
            label="스크랩"
            value={activity.scrapsCount}
            unit="개"
            accentClass="text-blue-600"
            iconBgClass="bg-blue-50"
          />
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium mb-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </span>
              <span className="text-sm">전주 대비</span>
            </div>
            <p
              className={cn(
                "text-2xl font-bold ml-2",
                isPositiveTrend && "text-green-600",
                isNegativeTrend && "text-red-500",
              )}
            >
              {activity.prevWeekComparison || "-"}
            </p>
          </div>
        </div>

        {topTags.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium mb-3">많이 본 태그 TOP3</p>
            <div className="flex flex-wrap gap-2">
              {topTags.slice(0, 3).map((tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary font-medium"
                >
                  <span className="text-xs text-muted-foreground">
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
      {/* TODO: 실제 API 연동 시 chartData는 API 응답으로 교체 예정 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">활동 분석</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium mb-4">요일별 활동량</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData.dailyActivities}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="dayOfWeek"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [value, "활동"]}
                  cursor={false}
                />
                {/* --chart-1: globals.css 차트 전용 CSS 변수 */}
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium mb-4">태그별 활동</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={chartData.tagActivities}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="tagName"
                  tick={{
                    fontSize: 11,
                    fill: "var(--color-foreground)",
                    fontWeight: 500,
                  }}
                />
                <Radar
                  dataKey="count"
                  fill="var(--chart-1)"
                  fillOpacity={0.3}
                  stroke="var(--chart-1)"
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [value, "활동"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 섹션 3: AI 인사이트 */}
      {/* TODO: 실제 API 연동 시 aiInsight는 API 응답으로 교체 예정 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">AI 인사이트</h2>
        {aiInsight === null ||
        (!aiInsight.wellDone && !aiInsight.lacking && !aiInsight.nextWeek) ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted-foreground font-medium">
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
                iconClass="text-blue-500"
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
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center gap-1.5 text-muted-foreground font-medium mb-2">
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full",
            iconBgClass,
          )}
        >
          <Icon className={cn("w-4 h-4", accentClass)} />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold ml-2">
        {value}
        <span className="text-sm font-medium text-muted-foreground ml-1">
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
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", iconClass)} />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="pl-6 text-sm text-muted-foreground font-medium leading-relaxed">
        {content}
      </p>
    </div>
  );
}
