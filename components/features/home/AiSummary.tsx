"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
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
  preparing: {
    icon: Clock,
    title: "요약을 준비하고 있어요",
    description:
      "AI가 콘텐츠를 분석 중이에요.\n잠시 후 자동으로 다시 시도합니다.",
    buttonLabel: "지금 다시 시도",
  },
};

const PREPARING_COUNTDOWN_SEC = 30;

// ─── 스켈레톤 ─────────────────────────────────────────────────────────────────

function AiSummarySkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* 키워드 */}
      <div className="space-y-3">
        <div className="h-4 w-12 rounded-md bg-secondary" />
        <div className="flex flex-wrap gap-1.5">
          <div className="h-7 w-14 rounded-md bg-secondary" />
          <div className="h-7 w-20 rounded-md bg-secondary" />
          <div className="h-7 w-16 rounded-md bg-secondary" />
          <div className="h-7 w-12 rounded-md bg-secondary" />
        </div>
      </div>

      {/* 핵심 요약 */}
      <div className="space-y-3">
        <div className="h-4 w-16 rounded-md bg-secondary" />
        <div className="h-4 w-full rounded-md bg-secondary" />
        <div className="h-4 w-5/6 rounded-md bg-secondary" />
        <div className="h-4 w-4/6 rounded-md bg-secondary" />
      </div>

      {/* 핵심 포인트 */}
      <div className="space-y-3">
        <div className="h-4 w-20 rounded-md bg-secondary" />
        <div className="h-4 w-full rounded-md bg-secondary" />
        <div className="h-4 w-5/6 rounded-md bg-secondary" />
        <div className="h-4 w-4/5 rounded-md bg-secondary" />
      </div>

      {/* 다음 추천 */}
      <div className="space-y-3">
        <div className="h-4 w-16 rounded-md bg-secondary" />
        <div className="h-4 w-full rounded-md bg-secondary" />
        <div className="h-4 w-3/4 rounded-md bg-secondary" />
      </div>

      {/* 추가 질문 */}
      <div className="space-y-2">
        <div className="h-4 w-24 rounded-md bg-secondary" />
        <div className="h-12 w-full rounded-lg bg-secondary" />
        <div className="h-12 w-full rounded-lg bg-secondary" />
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

  const [countdown, setCountdown] = useState(
    kind === "preparing" ? PREPARING_COUNTDOWN_SEC : 0,
  );
  const retryFiredRef = useRef(false);

  useEffect(() => {
    if (kind !== "preparing") return;
    if (countdown <= 0) {
      if (!retryFiredRef.current) {
        retryFiredRef.current = true;
        onRetry();
      }
      return;
    }
    retryFiredRef.current = false;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [kind, countdown, onRetry]);

  function handleButtonClick() {
    if (kind === "preparing") setCountdown(PREPARING_COUNTDOWN_SEC);
    onRetry();
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-md font-semibold text-foreground">{title}</p>
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground font-medium">
          {description}
        </p>
        {kind === "preparing" && countdown > 0 && (
          <p className="text-xs text-muted-foreground">
            {countdown}초 후 자동으로 다시 시도합니다
          </p>
        )}
      </div>
      <button
        onClick={handleButtonClick}
        disabled={isRetrying}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
          isRetrying
            ? "cursor-not-allowed bg-primary/50 text-primary-foreground"
            : "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90",
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
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setErrorCode(null);
      setSummary(null);
      try {
        const res = await contentsEndpoints.getContentSummary(contentId, level);
        setSummary(res.data);
      } catch (err) {
        const { code } = extractApiError(err);
        setErrorCode(code ?? "UNKNOWN");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [contentId, level]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setErrorCode(null);
    setRefetchKey((k) => k + 1);
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

  const handleRefetch = useCallback(() => {
    setIsLoading(true);
    setErrorCode(null);
    setSummary(null);
    setRefetchKey((k) => k + 1);
    contentsEndpoints
      .getContentSummary(contentId, level)
      .then((res) => setSummary(res.data))
      .catch((err) => {
        const { code } = extractApiError(err);
        setErrorCode(code ?? "UNKNOWN");
      })
      .finally(() => setIsLoading(false));
  }, [contentId, level]);

  return (
    <section className="mb-10">
      {/* 헤더 */}
      <div className="mb-6 flex items-end justify-between border-b border-border">
        <div className="flex items-center gap-2 pb-3">
          <span className="text-lg font-semibold text-foreground">AI 요약</span>
          {summary && !isLoading && (
            <>
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                난이도 · {summary.difficulty}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs font-medium text-muted-foreground">
                신뢰도 · {Math.round(summary.confidence * 100)}%
              </span>
            </>
          )}
        </div>
        <div className="flex gap-6">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "rounded-none border-b-2 px-3 pb-3 pt-1 text-sm font-semibold transition-colors cursor-pointer",
                level === l
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* 본문 */}
      {isLoading || isRetrying ? (
        <AiSummarySkeleton />
      ) : errorCode ? (
        <AiSummaryFallback
          key={`${errorCode ?? "none"}-${refetchKey}`}
          kind={getAiSummaryErrorKind(errorCode)}
          isRetrying={isRetrying}
          onRetry={
            getAiSummaryErrorKind(errorCode) === "preparing"
              ? handleRefetch
              : handleRetry
          }
        />
      ) : summary ? (
        <div className="space-y-8">
          {/* 키워드 */}
          {summary.keywords.length > 0 && (
            <div>
              <p className="mb-2 text-md font-semibold uppercase tracking-wide text-foreground">
                키워드
              </p>
              <div className="flex flex-wrap gap-1.5">
                {summary.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 핵심 요약 */}
          <div>
            <p className="mb-1.5 text-md font-semibold uppercase tracking-wide text-foreground">
              핵심 요약
            </p>
            <p className="text-foreground/85 font-medium leading-7 whitespace-pre-line">
              {summary.coreSummary}
            </p>
          </div>

          {/* 핵심 포인트 */}
          {summary.keyPoints.length > 0 && (
            <div>
              <p className="mb-2 text-md font-semibold uppercase tracking-wide text-foreground">
                핵심 포인트
              </p>
              <ul className="space-y-1.5">
                {summary.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 leading-7 text-foreground/85 font-medium"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 다음 추천 */}
          {summary.nextRecommendation && (
            <div>
              <p className="mb-1 text-md font-semibold uppercase tracking-wide text-foreground">
                다음 추천
              </p>
              <p className="leading-7 text-foreground/85 font-medium">
                {summary.nextRecommendation}
              </p>
            </div>
          )}

          {/* 추가 질문 */}
          {summary.additionalQuestions.length > 0 && (
            <div>
              <p className="mb-2 text-md font-semibold uppercase tracking-wide text-foreground">
                더 생각해볼 질문
              </p>
              <ol className="space-y-2">
                {summary.additionalQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="rounded-lg bg-secondary/50 px-4 py-2.5 leading-7 text-foreground/85 font-medium"
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
    </section>
  );
}
