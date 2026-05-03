import type { ComponentType } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchBreakdown, MatchItem, MatchItemStatus } from "@/types/jobs";

interface JobMatchSectionProps {
  matchScore: number;
  matchBreakdown: MatchBreakdown;
}

const STATUS_ICON: Record<
  MatchItemStatus,
  ComponentType<{ className?: string }>
> = {
  MET: CheckCircle2,
  UNMET: XCircle,
  PARTIAL: AlertTriangle,
};

const STATUS_CLASS: Record<MatchItemStatus, string> = {
  MET: "text-emerald-600",
  UNMET: "text-destructive",
  PARTIAL: "text-amber-500",
};

function MatchStatusRow({ item }: { item: MatchItem }) {
  const Icon = STATUS_ICON[item.status];
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className={cn("mt-0.5 h-4 w-4 shrink-0", STATUS_CLASS[item.status])}
      />
      <span className="text-sm leading-relaxed text-foreground">{item.label}</span>
    </div>
  );
}

interface SubSectionProps {
  title: string;
  score: number;
  maxScore: number;
  summary: string;
  items: MatchItem[];
}

function MatchSubSection({
  title,
  score,
  maxScore,
  summary,
  items,
}: SubSectionProps) {
  const hasScoreGauge = maxScore > 0;
  const pct = hasScoreGauge ? Math.round((score / maxScore) * 100) : 0;

  const scoreRightLabel =
    !hasScoreGauge && score === 0 ? "항목 없음" : `${score} / ${maxScore}점`;

  return (
    <div className="rounded-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">{title}</span>
        <span className="text-xs font-semibold text-muted-foreground">
          {scoreRightLabel}
        </span>
      </div>
      <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            hasScoreGauge ? "bg-primary" : "w-0",
          )}
          style={{
            width: hasScoreGauge ? `${pct}%` : undefined,
          }}
        />
      </div>
      <p className="mb-3 text-[11px] font-medium text-muted-foreground">
        {summary}
      </p>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <MatchStatusRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export function JobMatchSection({
  matchScore,
  matchBreakdown,
}: JobMatchSectionProps) {
  const scoreColor =
    matchScore >= 80
      ? "text-emerald-600"
      : matchScore >= 60
        ? "text-primary"
        : "text-muted-foreground";

  const barColor =
    matchScore >= 80
      ? "bg-emerald-500"
      : matchScore >= 60
        ? "bg-primary"
        : "bg-muted-foreground/40";

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold tracking-[-0.01em] text-foreground">
        요구 역량 vs 내 역량
      </h2>

      {/* 전체 매칭 점수 */}
      <div className="flex items-center gap-4">
        <span className={cn("text-4xl font-black tabular-nums", scoreColor)}>
          {matchScore}
        </span>
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>매칭 점수</span>
            <span>{matchScore} / 100</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", barColor)}
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 세부 섹션 */}
      <div className="flex flex-col gap-6">
        <MatchSubSection
          title="자격 요건"
          score={matchBreakdown.requirements.score}
          maxScore={matchBreakdown.requirements.maxScore}
          summary={matchBreakdown.requirements.summary}
          items={matchBreakdown.requirements.items}
        />
        <MatchSubSection
          title="우대 사항"
          score={matchBreakdown.preferred.score}
          maxScore={matchBreakdown.preferred.maxScore}
          summary={matchBreakdown.preferred.summary}
          items={matchBreakdown.preferred.items}
        />
        <MatchSubSection
          title="경력 수준"
          score={matchBreakdown.experience.score}
          maxScore={matchBreakdown.experience.maxScore}
          summary={matchBreakdown.experience.summary}
          items={matchBreakdown.experience.items}
        />
      </div>
    </section>
  );
}
