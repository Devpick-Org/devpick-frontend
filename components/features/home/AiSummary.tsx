"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { contentsEndpoints } from "@/lib/api/endpoints/contents";
import type {
  AiSummary as AiSummaryType,
  AiSummaryLevel,
} from "@/types/content";
import { cn } from "@/lib/utils";

// ─── 상수 ────────────────────────────────────────────────────────────────────

const LEVELS: AiSummaryLevel[] = ["BEGINNER", "JUNIOR", "MIDDLE", "SENIOR"];

const POLL_INTERVAL_MS = 7000; // 7초 간격
const POLL_MAX_MS = 5 * 60 * 1000; // 최대 5분

const LEVEL_LABELS: Record<AiSummaryLevel, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

// ─── 준비 중 UI ───────────────────────────────────────────────────────────────

function AiSummaryPreparing() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-md font-semibold text-foreground">
          AI 요약을 준비하고 있어요
        </p>
        <p className="text-sm leading-6 text-muted-foreground font-medium">
          콘텐츠를 분석 중입니다. 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}

// ─── 아직 준비 안 됨 UI ───────────────────────────────────────────────────────

function AiSummaryNotReady() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="space-y-1.5">
        <p className="text-md font-semibold text-foreground">
          아직 요약이 준비되지 않았어요.
        </p>
        <p className="text-sm leading-6 text-muted-foreground font-medium">
          몇 분 뒤 다시 확인해 주세요.
        </p>
      </div>
    </div>
  );
}

// ─── 에러 UI ──────────────────────────────────────────────────────────────────

function AiSummaryError() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-md font-semibold text-foreground">
          AI 요약을 불러오지 못했어요
        </p>
        <p className="text-sm leading-6 text-muted-foreground font-medium">
          AI 서버에 일시적인 오류가 발생했어요.
          <br />
          잠시 후 다시 확인해 주세요.
        </p>
      </div>
    </div>
  );
}

// ─── AiSummaryContent (내부 — key로 리마운트) ─────────────────────────────────
// contentId · level 조합이 바뀌면 key가 바뀌어 리마운트되므로
// 초기 상태는 항상 "preparing"에서 시작한다.
// effect 내 sync setState 없이 상태 초기화가 보장된다.

type SummaryStatus = "preparing" | "notReady" | "error" | "success";

interface AiSummaryContentProps {
  contentId: string;
  level: AiSummaryLevel;
  onSuccess: (summary: AiSummaryType) => void;
}

function AiSummaryContent({ contentId, level, onSuccess }: AiSummaryContentProps) {
  const [status, setStatus] = useState<SummaryStatus>("preparing");
  const [summary, setSummary] = useState<AiSummaryType | null>(null);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDeadlineRef = useRef<number>(0);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    contentsEndpoints
      .getContentSummary(contentId, level)
      .then((result) => {
        if (result.ready) {
          setSummary(result.summary);
          setStatus("success");
          onSuccess(result.summary);
          return;
        }
        // 202 — 폴링 시작
        stopPolling();
        pollDeadlineRef.current = Date.now() + POLL_MAX_MS;
        pollIntervalRef.current = setInterval(() => {
          if (Date.now() >= pollDeadlineRef.current) {
            stopPolling();
            setStatus("notReady");
            return;
          }
          contentsEndpoints
            .getContentSummary(contentId, level)
            .then((r) => {
              if (r.ready) {
                stopPolling();
                setSummary(r.summary);
                setStatus("success");
                onSuccess(r.summary);
              } else if (Date.now() >= pollDeadlineRef.current) {
                stopPolling();
                setStatus("notReady");
              }
            })
            .catch(() => {
              stopPolling();
              setStatus("error");
            });
        }, POLL_INTERVAL_MS);
      })
      .catch(() => {
        setStatus("error");
      });

    return () => stopPolling();
  }, [contentId, level, stopPolling, onSuccess]);

  if (status === "preparing") return <AiSummaryPreparing />;
  if (status === "notReady") return <AiSummaryNotReady />;
  if (status === "error") return <AiSummaryError />;
  if (status !== "success" || !summary) return null;

  return (
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
  );
}

// ─── AiSummary (외부 — 레벨 탭 + 헤더 메타) ──────────────────────────────────
// level 상태와 탭 UI를 소유한다.
// AiSummaryContent에 key를 내려줘 level/contentId 변경 시 리마운트를 유도한다.

interface AiSummaryProps {
  contentId: string;
}

// meta에 forKey를 포함해 "어떤 contentId+level 요청의 결과인지" 기록한다.
// 현재 contentId+level과 일치할 때만 헤더에 표시하므로
// useEffect 없이도 contentId·level 변경 시 이전 메타가 남지 않는다.
type SummaryMeta = {
  forKey: string;
  difficulty: string;
  confidence: number;
} | null;

export function AiSummary({ contentId }: AiSummaryProps) {
  const [level, setLevel] = useState<AiSummaryLevel>("JUNIOR");
  const [meta, setMeta] = useState<SummaryMeta>(null);

  const contentKey = `${contentId}-${level}`;
  // forKey가 현재 contentKey와 다르면 stale — 표시하지 않는다
  const visibleMeta = meta?.forKey === contentKey ? meta : null;

  const handleSuccess = useCallback(
    (s: AiSummaryType) => {
      setMeta({ forKey: `${contentId}-${level}`, difficulty: s.difficulty, confidence: s.confidence });
    },
    [contentId, level],
  );

  return (
    <section className="mb-10">
      {/* 헤더 */}
      <div className="mb-6 border-b border-border">
        <div className="flex items-center gap-2 pb-3">
          <span className="text-lg font-semibold text-foreground">AI 요약</span>
          {visibleMeta && (
            <>
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                난이도 · {visibleMeta.difficulty}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs font-medium text-muted-foreground">
                신뢰도 · {Math.round(visibleMeta.confidence * 100)}%
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
                "rounded-none border-b-2 pb-3 pt-1 text-sm font-semibold transition-colors cursor-pointer",
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

      {/* 본문 — contentId·level 변경 시 리마운트 */}
      <AiSummaryContent
        key={`${contentId}-${level}`}
        contentId={contentId}
        level={level}
        onSuccess={handleSuccess}
      />
    </section>
  );
}
