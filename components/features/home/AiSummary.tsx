"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
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

// ─── AiSummary ───────────────────────────────────────────────────────────────

interface AiSummaryProps {
  contentId: string;
}

export function AiSummary({ contentId }: AiSummaryProps) {
  const [level, setLevel] = useState<AiSummaryLevel>("JUNIOR");
  const [summary, setSummary] = useState<AiSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    contentsEndpoints
      .getContentSummary(contentId, level)
      .then((res) => setSummary(res.data))
      .finally(() => setIsLoading(false));
  }, [contentId, level]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    contentsEndpoints
      .retryContentSummary(contentId, level)
      .then((res) => setSummary(res.data))
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
                  "rounded-md px-2.5 py-1 text-sm font-medium transition-all duration-150",
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

          {/* 다시 생성 */}
          <button
            onClick={handleRetry}
            disabled={isLoading || isRetrying}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
              isLoading || isRetrying
                ? "cursor-not-allowed text-muted-foreground/40"
                : "text-muted-foreground hover:text-foreground",
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

          {/* 접기/펼치기 */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
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
          {isLoading || isRetrying || !summary ? (
            <AiSummarySkeleton />
          ) : (
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
          )}
        </div>
      )}
    </section>
  );
}
