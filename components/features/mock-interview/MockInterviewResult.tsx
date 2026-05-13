"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import type { MockInterviewSessionDetailApi } from "@/lib/api/endpoints/mock-interviews";
import { mockInterviewsEndpoints } from "@/lib/api/endpoints/mock-interviews";
import {
  parseMockInterviewResult,
  type MockInterviewPerQuestion,
  type MockInterviewResult as MIResult,
} from "@/lib/mock-interview/buildPlaceholderResult";
import {
  buildMockInterviewMarkdown,
  downloadMarkdown,
} from "@/lib/mock-interview/exportMarkdown";
import { cn } from "@/lib/utils";
import { MockInterviewRadarChart } from "./MockInterviewRadarChart";

const POLLING_INTERVAL_MS = 3000;
const POLLING_MAX_ATTEMPTS = 40; // 최대 2분

interface MockInterviewResultProps {
  session: MockInterviewSessionDetailApi;
  onSessionUpdate?: (session: MockInterviewSessionDetailApi) => void;
  previous?: MockInterviewSessionDetailApi | null;
  onRestart?: () => void;
}

const SCORE_LABEL: Record<keyof MIResult["scores"], string> = {
  framework: "프레임워크",
  design: "설계/판단",
  problemSolving: "문제 해결",
  csInfra: "CS/인프라",
  communication: "커뮤니케이션",
};

export function MockInterviewResult({
  session,
  onSessionUpdate,
  previous = null,
  onRestart,
}: MockInterviewResultProps) {
  const [pollingError, setPollingError] = useState(false);

  useEffect(() => {
    if (session.status !== "PROCESSING") return;

    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      if (attempts >= POLLING_MAX_ATTEMPTS) {
        clearInterval(timer);
        setPollingError(true);
        return;
      }
      try {
        const updated = await mockInterviewsEndpoints.get(session.id);
        if (updated.status === "COMPLETED" || updated.status === "EARLY_FINISHED") {
          clearInterval(timer);
          onSessionUpdate?.(updated);
        }
      } catch {
        // 네트워크 오류는 무시하고 계속 폴링
      }
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [session.status, session.id, onSessionUpdate]);

  const result = useMemo(
    () => parseMockInterviewResult(session.resultJson),
    [session.resultJson],
  );
  const previousResult = useMemo(
    () => (previous ? parseMockInterviewResult(previous.resultJson) : null),
    [previous],
  );

  if (session.status === "PROCESSING" || !result) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        {pollingError ? (
          <p>결과 생성에 시간이 너무 오래 걸리고 있습니다. 잠시 후 다시 확인해 주세요.</p>
        ) : (
          <>
            <p className="font-medium text-foreground">AI가 결과를 분석하고 있습니다.</p>
            <p className="mt-1">보통 30초~2분 정도 걸려요. 잠시만 기다려 주세요.</p>
          </>
        )}
      </div>
    );
  }

  const handleDownload = () => {
    const md = buildMockInterviewMarkdown(session, result);
    const filename = `mock-interview_${session.id.slice(0, 8)}.md`;
    downloadMarkdown(filename, md);
  };

  const isEarly = result.earlyFinished;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            모의면접 결과
          </p>
          <h2 className="text-xl font-bold text-foreground">
            {session.companyName || "직접 입력 JD"} · {session.jobTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            진행 {result.answeredCount}/{result.totalQuestions} 문항 · 모델 {session.modelKey}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
          >
            <Download className="h-4 w-4" /> .md 내보내기
          </button>
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              새 모의면접 시작
            </button>
          )}
        </div>
      </header>

      {result.notice && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-700 dark:text-amber-200">
          <p className="leading-relaxed">{result.notice}</p>
        </div>
      )}

      {isEarly && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-700 dark:text-amber-200">
          <p className="font-semibold">조기 종료된 면접입니다.</p>
          <p className="mt-1 leading-relaxed">
            진행률에 따라 점수가 보정되었어요(계수 {result.coverageFactor.toFixed(2)}).
            질문하지 않은 영역은 &ldquo;—&rdquo;로 표시되며, 이전 면접과의 비교 섹션은 표시하지 않습니다.
          </p>
        </div>
      )}

      <section className="grid gap-5 rounded-2xl border border-border bg-card p-5 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center justify-center gap-2">
          <MockInterviewRadarChart scores={result.scores} />
          <p className="text-xs text-muted-foreground">
            종합 점수: {result.overallScore != null ? result.overallScore : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <h3 className="text-base font-semibold text-foreground">영역별 점수</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(result.scores) as Array<keyof MIResult["scores"]>).map((k) => {
              const cur = result.scores[k];
              const prev = previousResult?.scores[k] ?? null;
              const delta =
                cur != null && prev != null ? cur - prev : null;
              return (
                <li
                  key={k}
                  className="rounded-xl border border-border px-3 py-2"
                >
                  <p className="text-xs text-muted-foreground">{SCORE_LABEL[k]}</p>
                  <div className="mt-0.5 flex items-baseline justify-between gap-2">
                    <span className="text-lg font-semibold text-foreground">
                      {cur != null ? cur : "—"}
                    </span>
                    {!isEarly && delta != null && (
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          delta > 0
                            ? "text-emerald-600"
                            : delta < 0
                              ? "text-rose-600"
                              : "text-muted-foreground",
                        )}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {result.summary && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground">전체 인상</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {result.summary}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5">
        <FeedbackList title="강점" items={result.strengths} />
        <FeedbackList title="개선 필요" items={result.improvements} />
        <FeedbackList title="액션 아이템" items={result.actionItems} />
        {result.uncoveredKeywords.length > 0 && (
          <FeedbackList
            title="다루지 못한 영역 (JD에 있지만 면접에서 질문되지 않음)"
            items={result.uncoveredKeywords}
          />
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-semibold text-foreground">
          QA 모범 답안 ({result.perQuestion.length}개)
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          질문하지 않은 영역은 &ldquo;부족하다&rdquo;고 평가하지 않아요. 실제 답변 기반으로만 정리했어요.
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {result.perQuestion.map((p) => (
            <PerQuestionCard
              key={p.questionNo}
              perQuestion={p}
              session={session}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

function FeedbackList({
  title,
  items,
  className,
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <p className="mb-1.5 text-base font-semibold text-foreground">{title}</p>
      <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-muted-foreground">
        {items.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[0.4rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
            <span className="whitespace-pre-wrap">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerQuestionCard({
  perQuestion,
  session,
}: {
  perQuestion: MockInterviewPerQuestion;
  session: MockInterviewSessionDetailApi;
}) {
  const [open, setOpen] = useState(false);
  const planQuestion = session.plan.questions.find(
    (q) => q.questionNo === perQuestion.questionNo,
  );
  const transcript = session.turns.filter(
    (t) => t.questionNo === perQuestion.questionNo,
  );
  const ratingBadge = ratingBadgeFor(perQuestion);

  return (
    <li className="rounded-xl border border-border bg-card/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Q{perQuestion.questionNo} · {planQuestion?.topic ?? ""}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                ratingBadge.tone,
              )}
            >
              {ratingBadge.label}
            </span>
          </span>
          <p className="truncate text-sm font-semibold text-foreground">
            {perQuestion.questionSummary || planQuestion?.prompt || ""}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            내 답변: {perQuestion.answerSummary || perQuestion.answerRaw || "—"}
          </p>
        </div>
        {open ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="space-y-4 border-t border-border px-4 py-4 text-sm leading-relaxed">
          <div>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">원문 보기</p>
            <ul className="flex flex-col gap-2">
              {transcript.map((turn) => {
                const tone = transcriptTone(turn.type);
                return (
                  <li
                    key={turn.orderNo}
                    className={cn("rounded-lg px-3 py-2", tone)}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {transcriptLabel(turn.type)}
                    </p>
                    <p className="whitespace-pre-wrap text-[13px] text-foreground">
                      {turn.content}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          {perQuestion.modelAnswer && (
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">모범 답안</p>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {perQuestion.modelAnswer}
              </p>
            </div>
          )}
          {perQuestion.whyImportant && (
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">중요한 이유</strong> ·{" "}
              {perQuestion.whyImportant}
            </p>
          )}
          {perQuestion.learningDirection && (
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">학습 방향</strong> ·{" "}
              {perQuestion.learningDirection}
            </p>
          )}
          {perQuestion.references.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">참고 자료</strong>
              <ul className="mt-1 flex flex-col gap-1">
                {perQuestion.references.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function ratingBadgeFor(p: MockInterviewPerQuestion): {
  label: string;
  tone: string;
} {
  if (p.passed) {
    return {
      label: "패스",
      tone: "bg-rose-500/15 text-rose-700 dark:text-rose-200",
    };
  }
  switch (p.rating) {
    case "GOOD":
      return {
        label: "좋음",
        tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
      };
    case "OK":
      return {
        label: "보통",
        tone: "bg-muted text-foreground",
      };
    case "WEAK":
      return {
        label: "미흡",
        tone: "bg-rose-500/15 text-rose-700 dark:text-rose-200",
      };
    default:
      return { label: "기록만", tone: "bg-muted text-muted-foreground" };
  }
}

function transcriptTone(type: string): string {
  switch (type) {
    case "QUESTION":
      return "bg-muted/30";
    case "ANSWER":
      return "bg-primary/5";
    case "FOLLOW_UP_QUESTION":
      return "bg-cyan-500/5";
    case "FOLLOW_UP_ANSWER":
      return "bg-cyan-400/5";
    case "RETRY_REQUEST":
      return "bg-rose-500/5";
    case "RETRY_ANSWER":
      return "bg-rose-400/5";
    case "PASS":
      return "bg-amber-500/5";
    default:
      return "bg-card";
  }
}

function transcriptLabel(type: string): string {
  switch (type) {
    case "QUESTION":
      return "질문";
    case "ANSWER":
      return "내 답변";
    case "FOLLOW_UP_QUESTION":
      return "꼬리질문";
    case "FOLLOW_UP_ANSWER":
      return "꼬리질문 답변";
    case "RETRY_REQUEST":
      return "재답변 요청";
    case "RETRY_ANSWER":
      return "재답변";
    case "PASS":
      return "패스";
    default:
      return type;
  }
}
