"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  FileQuestion,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import { extractApiError } from "@/lib/api/extractApiError";
import {
  getAiSummaryErrorKind,
  type AiSummaryErrorKind,
} from "@/lib/content/getContentErrorMessage";
import type {
  AiSummary as AiSummaryType,
  AiSummaryLevel,
} from "@/types/content";
import { cn } from "@/lib/utils";

// ─── 상수 ────────────────────────────────────────────────────────────────────

const LEVELS: AiSummaryLevel[] = ["BEGINNER", "JUNIOR", "MIDDLE", "SENIOR"];

const LEVEL_LABELS: Record<AiSummaryLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

// ─── Fallback 설정 ────────────────────────────────────────────────────────────

interface FallbackConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonLabel: string;
}

const FALLBACK_CONFIG: Record<AiSummaryErrorKind, FallbackConfig> = {
  empty: {
    icon: FileQuestion,
    title: "아직 요약이 없어요",
    description:
      "이 글에 대한 AI 요약이 준비되지 않았습니다.\n직접 생성해 볼 수 있어요.",
    buttonLabel: "요약 생성하기",
  },
  timeout: {
    icon: Clock,
    title: "응답 시간이 초과됐어요",
    description:
      "AI 서버가 응답하는 데 시간이 오래 걸렸습니다.\n잠시 후 다시 시도해 주세요.",
    buttonLabel: "다시 시도하기",
  },
  error: {
    icon: AlertCircle,
    title: "AI 요약을 불러오지 못했어요",
    description:
      "AI 서버에 일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.",
    buttonLabel: "다시 시도하기",
  },
};

// ─── 스켈레톤 ─────────────────────────────────────────────────────────────────

function AiSummarySkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* 난이도 · 신뢰도 뱃지 */}
      <div className="flex gap-2">
        <div className="h-6 w-24 rounded-full bg-secondary" />
        <div className="h-6 w-20 rounded-full bg-secondary" />
      </div>

      {/* 핵심 요약 */}
      <div className="space-y-2">
        <div className="h-3 w-16 rounded-md bg-secondary" />
        <div className="h-3 w-full rounded-md bg-secondary" />
        <div className="h-3 w-5/6 rounded-md bg-secondary" />
        <div className="h-3 w-4/6 rounded-md bg-secondary" />
      </div>

      {/* 핵심 포인트 */}
      <div className="space-y-2">
        <div className="h-3 w-20 rounded-md bg-secondary" />
        <div className="h-3 w-full rounded-md bg-secondary" />
        <div className="h-3 w-5/6 rounded-md bg-secondary" />
        <div className="h-3 w-4/5 rounded-md bg-secondary" />
      </div>

      {/* 키워드 */}
      <div className="space-y-2">
        <div className="h-3 w-12 rounded-md bg-secondary" />
        <div className="flex flex-wrap gap-1.5">
          <div className="h-6 w-14 rounded-md bg-secondary" />
          <div className="h-6 w-20 rounded-md bg-secondary" />
          <div className="h-6 w-16 rounded-md bg-secondary" />
          <div className="h-6 w-12 rounded-md bg-secondary" />
        </div>
      </div>

      {/* 다음 추천 */}
      <div className="space-y-2">
        <div className="h-3 w-16 rounded-md bg-secondary" />
        <div className="h-3 w-full rounded-md bg-secondary" />
        <div className="h-3 w-3/4 rounded-md bg-secondary" />
      </div>

      {/* 추가 질문 */}
      <div className="space-y-2">
        <div className="h-3 w-24 rounded-md bg-secondary" />
        <div className="h-10 w-full rounded-lg bg-secondary" />
        <div className="h-10 w-full rounded-lg bg-secondary" />
      </div>
    </div>
  );
}

// ─── Fallback UI ──────────────────────────────────────────────────────────────

interface AiSummaryFallbackProps {
  kind: AiSummaryErrorKind;
  isRetrying: boolean;
  onRetry: () => void;
}

function AiSummaryFallback({
  kind,
  isRetrying,
  onRetry,
}: AiSummaryFallbackProps) {
  const { icon: Icon, title, description, buttonLabel } = FALLBACK_CONFIG[kind];

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-background px-6 py-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground font-medium">
          {description}
        </p>
      </div>
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
          isRetrying
            ? "cursor-not-allowed bg-primary/50 text-primary-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {isRetrying ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5" />
        )}
        {isRetrying ? "생성 중..." : buttonLabel}
      </button>
    </div>
  );
}

// ─── AiSummary ───────────────────────────────────────────────────────────────

interface AiSummaryProps {
  contentId: string;
}

export function AiSummary({ contentId }: AiSummaryProps) {
  const [level, setLevel] = useState<AiSummaryLevel>("JUNIOR");
  const [summary, setSummary] = useState<AiSummaryType | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // 마지막으로 fetch한 레벨 추적 — 같은 레벨로 닫았다 다시 열어도 재호출 방지
  const [fetchedLevel, setFetchedLevel] = useState<AiSummaryLevel | null>(null);

  useEffect(() => {
    if (!isExpanded) return;
    if (fetchedLevel === level) return; // 이미 해당 레벨 데이터 있음

    void (async () => {
      setIsLoading(true);
      setErrorCode(null);
      try {
        const res = await contentsEndpoints.getContentSummary(contentId, level);
        setSummary(res.data);
        setFetchedLevel(level);
      } catch (err) {
        const { code } = extractApiError(err);
        setErrorCode(code ?? "UNKNOWN");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [contentId, level, isExpanded, fetchedLevel]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setErrorCode(null);
    contentsEndpoints
      .retryContentSummary(contentId, level)
      .then((res) => setSummary(res.data))
      .catch((err) => {
        const { code } = extractApiError(err);
        setErrorCode(code ?? "UNKNOWN");
        setSummary(null);
      })
      .finally(() => setIsRetrying(false));
  }, [contentId, level]);

  return (
    <section className="mb-10 overflow-hidden rounded-2xl bg-primary/5">
      {/* 헤더 */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 px-5 py-4",
          isExpanded && "border-b border-primary/15",
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-md font-semibold text-foreground">AI 요약</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 레벨 탭 */}
          <div className="flex rounded-lg bg-background p-0.5">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm font-medium transition-all duration-150 cursor-pointer",
                  level === l
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {LEVEL_LABELS[l]}
              </button>
            ))}
          </div>

          {/* 구분선 */}
          <div className="h-5 w-px bg-border" />

          {/* 다시 생성 — success 상태에서만 표시 */}
          {!errorCode && (
            <button
              onClick={handleRetry}
              disabled={isLoading || isRetrying}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
                isLoading || isRetrying
                  ? "cursor-not-allowed text-muted-foreground/40"
                  : "cursor-pointer text-muted-foreground hover:text-foreground",
              )}
              aria-label="AI 요약 다시 생성"
            >
              {isRetrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isRetrying ? "생성 중..." : "다시 생성"}
            </button>
          )}

          {/* 접기/펼치기 */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            aria-label={isExpanded ? "접기" : "펼치기"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* 본문 */}
      {isExpanded && (
        <div className="px-5 py-5">
          {isLoading || isRetrying ? (
            <AiSummarySkeleton />
          ) : errorCode ? (
            <AiSummaryFallback
              kind={getAiSummaryErrorKind(errorCode)}
              isRetrying={isRetrying}
              onRetry={handleRetry}
            />
          ) : summary ? (
            <div className="space-y-8">
              {/* 난이도 · 신뢰도 뱃지 */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground">
                  난이도 · {summary.difficulty}
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground">
                  신뢰도 · {Math.round(summary.confidence * 100)}%
                </span>
              </div>

              {/* 핵심 요약 */}
              <div>
                <p className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
                  핵심 요약
                </p>
                <p className="text-sm leading-7 text-foreground/85 font-medium">
                  {summary.coreSummary}
                </p>
              </div>

              {/* 핵심 포인트 */}
              {summary.keyPoints.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    핵심 포인트
                  </p>
                  <ul className="space-y-1.5">
                    {summary.keyPoints.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-6 text-foreground/85 font-medium"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 키워드 */}
              {summary.keywords.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    키워드
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {summary.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 다음 추천 */}
              {summary.nextRecommendation && (
                <div>
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary">
                    다음 추천
                  </p>
                  <p className="text-sm leading-6 text-foreground/85 font-medium">
                    {summary.nextRecommendation}
                  </p>
                </div>
              )}

              {/* 추가 질문 */}
              {summary.additionalQuestions.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    더 생각해볼 질문
                  </p>
                  <ol className="space-y-2">
                    {summary.additionalQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="rounded-lg bg-secondary/50 px-4 py-2.5 text-sm leading-6 text-foreground/85 font-medium"
                      >
                        <span className="mr-2 font-semibold text-primary">
                          Q{i + 1}.
                        </span>
                        {q}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
