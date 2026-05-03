"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_INTERVIEW_PHASE_STEPS } from "./phaseLabels";

export interface MockInterviewLoadingStepItem {
  key: string;
  title: string;
  subtitle?: string;
}

/** 새 모의면접 시작 — 플랜 생성 단계 */
export const PLAN_START_LOADING_STEPS: MockInterviewLoadingStepItem[] =
  MOCK_INTERVIEW_PHASE_STEPS.map((s) => ({
    key: s.phase,
    title: `${s.title} 질문 만드는 중`,
    subtitle: `포함 예정 문항 ${s.questionRangeLabel}`,
  }));

/** 방 — 답변/패스 시 AI 처리(참고용 순차 안내) */
export const ROOM_AI_LOADING_STEPS: MockInterviewLoadingStepItem[] =
  MOCK_INTERVIEW_PHASE_STEPS.map((s) => ({
    key: s.phase,
    title: `${s.title} 영역 반영 중`,
    subtitle: `문항 ${s.questionRangeLabel} 구간`,
  }));

export const ROOM_SAVE_LOADING_STEPS: MockInterviewLoadingStepItem[] = [
  { key: "sync", title: "진행 내용 저장 중", subtitle: "서버에 세션 동기화" },
  { key: "leave", title: "안전히 마무리하는 중", subtitle: "목록으로 돌아갈 준비" },
];

export const ROOM_FINISH_LOADING_STEPS: MockInterviewLoadingStepItem[] = [
  { key: "aggregate", title: "답변 집계 중", subtitle: "진행한 문항만 반영" },
  { key: "evaluate", title: "최종 평가 생성 중", subtitle: "점수·피드백 정리" },
  { key: "open", title: "결과 화면 준비 중", subtitle: "거의 완료" },
];

export function MockInterviewLoadingStepList({
  steps,
  running,
  intervalMs = 2400,
  className,
}: {
  steps: readonly MockInterviewLoadingStepItem[];
  running: boolean;
  intervalMs?: number;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!running) {
      const t = window.setTimeout(() => setActiveIndex(0), 0);
      return () => window.clearTimeout(t);
    }

    const maxIdx = Math.max(0, steps.length - 1);

    let intervalId: number | undefined;
    const outer = window.setTimeout(() => {
      setActiveIndex(0);
      intervalId = window.setInterval(() => {
        setActiveIndex((prev) => (prev >= maxIdx ? maxIdx : prev + 1));
      }, intervalMs);
    }, 0);

    return () => {
      window.clearTimeout(outer);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [running, intervalMs, steps.length]);

  return (
    <ol className={cn("mt-6 space-y-2 text-left", className)} aria-live="polite">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li
            key={step.key}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-[border-color,box-shadow,opacity,background-color]",
              active &&
                "border-primary/55 bg-gradient-to-br from-primary/[0.1] via-primary/[0.04] to-transparent shadow-md shadow-primary/10 ring-[1px] ring-primary/30",
              done && "border-emerald-500/35 bg-emerald-500/[0.06]",
              !done && !active && "border-border/50 bg-muted/15 opacity-[0.82]",
            )}
          >
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-background/90 ring-1 ring-border/50">
              {done ? (
                <Check
                  className="size-4 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                  strokeWidth={2.5}
                />
              ) : active ? (
                <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
              ) : (
                <span className="size-2 rounded-full bg-muted-foreground/30" aria-hidden />
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "leading-snug font-semibold",
                  (!active && !done) && "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              {step.subtitle ? (
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                  {step.subtitle}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
