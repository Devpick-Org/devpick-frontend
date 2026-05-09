"use client";

import { Fragment, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  CornerDownLeft,
  Flag,
  Loader2,
  RefreshCcw,
  SkipForward,
} from "lucide-react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/extractApiError";
import {
  mockInterviewsEndpoints,
  type MockInterviewQuestionPlanItem,
  type MockInterviewSessionDetailApi,
  type MockInterviewTurnApi,
} from "@/lib/api/endpoints/mock-interviews";
import { cn } from "@/lib/utils";
import { MockInterviewConversationLog } from "./MockInterviewConversationLog";
import {
  MockInterviewLoadingStepList,
  ROOM_AI_LOADING_STEPS,
  ROOM_FINISH_LOADING_STEPS,
  ROOM_SAVE_LOADING_STEPS,
} from "./MockInterviewLoadingStepList";
import { MOCK_INTERVIEW_PHASE_STEPS, phaseTitleKo } from "./phaseLabels";

interface MockInterviewRoomProps {
  session: MockInterviewSessionDetailApi;
  onSessionUpdate: (session: MockInterviewSessionDetailApi) => void;
  onCompleted: (session: MockInterviewSessionDetailApi) => void;
  onSavedExit: () => void;
}

export function MockInterviewRoom({
  session,
  onSessionUpdate,
  onCompleted,
  onSavedExit,
}: MockInterviewRoomProps) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");

  const currentQuestion: MockInterviewQuestionPlanItem | undefined = useMemo(
    () =>
      session.plan.questions.find(
        (q) => q.questionNo === session.currentQuestionIndex,
      ),
    [session.plan.questions, session.currentQuestionIndex],
  );

  const lastPrompt: MockInterviewTurnApi | undefined = useMemo(() => {
    for (let i = session.turns.length - 1; i >= 0; i -= 1) {
      const t = session.turns[i];
      if (
        t.questionNo === session.currentQuestionIndex &&
        (t.type === "QUESTION" ||
          t.type === "FOLLOW_UP_QUESTION" ||
          t.type === "RETRY_REQUEST")
      ) {
        return t;
      }
    }
    return undefined;
  }, [session.turns, session.currentQuestionIndex]);

  const lastEvaluation: MockInterviewTurnApi | undefined = useMemo(() => {
    for (let i = session.turns.length - 1; i >= 0; i -= 1) {
      const t = session.turns[i];
      if (t.rating) return t;
    }
    return undefined;
  }, [session.turns]);

  const answerMutation = useMutation({
    mutationFn: (content: string) =>
      mockInterviewsEndpoints.answer(
        session.id,
        session.currentQuestionIndex,
        content,
      ),
    onSuccess: (outcome) => {
      onSessionUpdate(outcome.session);
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      setDraft("");
      if (outcome.sessionCompleted) {
        toast.success("모의면접을 완료했어요. 결과를 확인해 주세요.");
        onCompleted(outcome.session);
      }
    },
    onError: (err) => {
      const { message } = extractApiError(err);
      toast.error(message ?? "답변 전송에 실패했습니다.");
    },
  });

  const passMutation = useMutation({
    mutationFn: () =>
      mockInterviewsEndpoints.pass(session.id, session.currentQuestionIndex),
    onSuccess: (next) => {
      onSessionUpdate(next);
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      if (next.status !== "IN_PROGRESS") {
        onCompleted(next);
      }
    },
    onError: (err) => {
      const { message } = extractApiError(err);
      toast.error(message ?? "패스에 실패했습니다.");
    },
  });

  const saveExitMutation = useMutation({
    mutationFn: () => mockInterviewsEndpoints.saveAndExit(session.id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      toast.success("진행 상태를 저장했어요. 언제든 이어서 진행할 수 있어요.");
      onSavedExit();
    },
  });

  const finishEarlyMutation = useMutation({
    mutationFn: () => mockInterviewsEndpoints.finishEarly(session.id),
    onSuccess: (next) => {
      onSessionUpdate(next);
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      onCompleted(next);
      toast.success("진행한 답변만으로 결과를 정리했어요.");
    },
  });

  if (!currentQuestion) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-8 text-center text-sm text-muted-foreground shadow-inner">
        질문 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const phaseKo = phaseTitleKo(currentQuestion.phase);

  const overlayVariant =
    answerMutation.isPending
      ? "answer"
      : passMutation.isPending
        ? "pass"
        : saveExitMutation.isPending
          ? "save"
          : finishEarlyMutation.isPending
            ? "finish"
            : null;

  const blockingAnswerOrPass =
    answerMutation.isPending || passMutation.isPending;

  const handleSubmit = () => {
    const content = draft.trim();
    if (!content) {
      toast.error("답변 내용을 입력해 주세요.");
      return;
    }
    answerMutation.mutate(content);
  };

  return (
    <div className="relative grid gap-7 lg:grid-cols-[1.35fr_minmax(0,1fr)]">
      {overlayVariant ? <BusyOverlay variant={overlayVariant} /> : null}

      <div className="flex min-w-0 flex-col gap-5">
        <PhaseBar currentNo={currentQuestion.questionNo} />

        <article className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 px-6 py-6 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(600px_120px_at_50%_-20%,var(--color-primary)_0%,transparent_70%)] opacity-[0.09]"
          />
          <div className="relative mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold tabular-nums tracking-tight text-primary">
              Q{currentQuestion.questionNo} / {session.totalQuestions}
            </span>
            <span className="rounded-full bg-muted/90 px-2.5 py-1 text-xs font-semibold text-foreground ring-1 ring-border/60">
              {phaseKo}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              · {currentQuestion.topic}
            </span>
            {currentQuestion.jdOnlyKeyword ? (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                JD 키워드
              </span>
            ) : null}
          </div>
          <p className="relative whitespace-pre-wrap text-base font-medium leading-relaxed tracking-tight text-foreground">
            {lastPrompt?.content ?? currentQuestion.prompt}
          </p>
          {lastEvaluation?.rating && lastPrompt?.type !== "QUESTION" ? (
            <div className="relative mt-4 rounded-2xl border border-border/60 bg-muted/35 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              직전 답변 평가:{" "}
              <strong className="text-foreground">{ratingText(lastEvaluation.rating)}</strong>
              {lastEvaluation.metadata &&
              typeof lastEvaluation.metadata.evaluatorComment === "string" ? (
                <>
                  {" · "}
                  {String(lastEvaluation.metadata.evaluatorComment)}
                </>
              ) : null}
            </div>
          ) : null}
        </article>

        <div className="rounded-3xl border border-border/70 bg-card/90 p-5 ring-1 ring-black/[0.03] dark:bg-card dark:ring-white/[0.05]">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!blockingAnswerOrPass) handleSubmit();
              }
            }}
            placeholder="답변을 입력하세요. Enter로 전송 · Shift+Enter로 줄바꿈."
            rows={6}
            disabled={blockingAnswerOrPass}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-shadow placeholder:text-muted-foreground disabled:opacity-65"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => passMutation.mutate()}
                disabled={blockingAnswerOrPass}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border/90 bg-background/80 px-3.5 py-2 text-xs font-semibold hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden /> 질문 패스
              </button>
              <button
                type="button"
                onClick={() => saveExitMutation.mutate()}
                disabled={blockingAnswerOrPass || saveExitMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border/90 bg-background/80 px-3.5 py-2 text-xs font-semibold hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
              >
                {saveExitMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
                )}
                저장 후 나가기
              </button>
              <button
                type="button"
                onClick={() => finishEarlyMutation.mutate()}
                disabled={blockingAnswerOrPass || finishEarlyMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-500/45 bg-rose-500/[0.04] px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-500/10 dark:text-rose-300 disabled:pointer-events-none disabled:opacity-50"
              >
                {finishEarlyMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                ) : (
                  <Flag className="h-3.5 w-3.5" aria-hidden />
                )}
                여기서 마치기
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={blockingAnswerOrPass || !draft.trim()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold tracking-tight text-primary-foreground transition-[transform,background-color] hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
            >
              {answerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <CornerDownLeft className="h-4 w-4" aria-hidden />
              )}
              답변 보내기
            </button>
          </div>
        </div>

        <aside className="rounded-3xl border border-border/55 bg-muted/25 px-5 py-4 text-xs leading-relaxed text-muted-foreground ring-1 ring-black/[0.02] backdrop-blur-sm dark:bg-muted/15 dark:ring-white/[0.04]">
          <p className="mb-3 text-sm font-bold text-foreground">실전 팁</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="rounded-xl bg-background/50 px-3 py-2 ring-1 ring-border/50">
              결론 → 스택 → 디테일 순으로 말하면 꼬리질문이 더 생산적이에요.
            </li>
            <li className="rounded-xl bg-background/50 px-3 py-2 ring-1 ring-border/50">
              모르는 질문은 패스 후, 시간을 아는 문항에 쓰는 편이 유리해요.
            </li>
            <li className="rounded-xl bg-background/50 px-3 py-2 ring-1 ring-border/50">
              공고 JD를 채워 두면 맞춤 질문 품질이 올라가요.
            </li>
            <li className="rounded-xl bg-background/50 px-3 py-2 ring-1 ring-border/50">
              완료 후 이전 결과와 점수·피드를 비교해 볼 수 있어요.
            </li>
          </ul>
        </aside>
      </div>

      <aside className="flex min-h-0 min-w-0 flex-col gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-gradient-to-r from-muted/35 to-muted/15 px-4 py-3.5 ring-1 ring-black/[0.03] backdrop-blur-sm dark:from-muted/20 dark:to-muted/10">
          <p className="font-bold text-foreground">대화 로그</p>
          <span className="tabular-nums text-[11px] font-semibold text-muted-foreground">
            진행 {session.answeredCount}/{session.totalQuestions}
          </span>
        </div>
        <MockInterviewConversationLog session={session} />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          로그는 실시간 저장돼요. 새로고침 후에도 이어서 진행할 수 있습니다.
        </p>
      </aside>
    </div>
  );
}

function PhaseBar({ currentNo }: { currentNo: number }) {
  return (
    <nav
      className="flex items-stretch gap-1.5 overflow-x-auto pb-2 pt-0.5 [scrollbar-width:thin] snap-x snap-mandatory px-1 scroll-pl-1"
      aria-label="모의면접 단계"
    >
      {MOCK_INTERVIEW_PHASE_STEPS.map((step, i) => {
        const active = currentNo >= step.from && currentNo <= step.to;
        const done = currentNo > step.to;
        return (
          <Fragment key={step.phase}>
            <div
              className={cn(
                "flex min-w-[108px] max-w-[128px] shrink-0 snap-start flex-col items-center rounded-2xl border px-3 py-2.5 text-center transition-[border-color,box-shadow,background-color]",
                active &&
                  "border-primary/55 bg-gradient-to-br from-primary/[0.14] via-primary/[0.05] to-transparent shadow-md shadow-primary/10 ring-[1.5px] ring-primary/35",
                done &&
                  !active &&
                  "border-emerald-500/35 bg-emerald-500/[0.07] shadow-sm",
                !active && !done && "border-border/70 bg-muted/25 opacity-95",
              )}
            >
              <div className="flex items-center justify-center gap-1">
                <span
                  className={cn(
                    "text-[13px] font-bold leading-tight",
                    active || done ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
                {done ? (
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 stroke-[2.5] text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : null}
              </div>
              <span className="mt-1 text-[11px] font-semibold tabular-nums tracking-tight text-muted-foreground">
                문항 {step.questionRangeLabel}
              </span>
            </div>
            {i < MOCK_INTERVIEW_PHASE_STEPS.length - 1 ? (
              <ChevronRight
                className="hidden shrink-0 self-center text-muted-foreground/25 sm:block"
                aria-hidden
                strokeWidth={1.75}
              />
            ) : null}
          </Fragment>
        );
      })}
    </nav>
  );
}

function BusyOverlay({
  variant,
}: {
  variant: "answer" | "pass" | "save" | "finish";
}) {
  const copyMap = {
    answer: {
      title: "답변 분석 중",
      body:
        "AI가 평가·피드백과 다음 단계를 준비하고 있어요. 보통 몇 초~수십 초 걸려요.",
    },
    pass: {
      title: "다음 문항으로 이동 중",
      body: "패스를 반영하고 이어서 질문을 준비하고 있어요.",
    },
    save: {
      title: "저장 중",
      body: "진행 상태를 서버에 기록하고 있어요. 잠시만 기다려 주세요.",
    },
    finish: {
      title: "결과 정리 중",
      body: "지금까지 답변을 요약하고 최종 평가를 만드는 중이에요.",
    },
  } as const;

  const { title, body } = copyMap[variant];

  const steps =
    variant === "answer" || variant === "pass"
      ? ROOM_AI_LOADING_STEPS
      : variant === "save"
        ? ROOM_SAVE_LOADING_STEPS
        : ROOM_FINISH_LOADING_STEPS;
  const intervalMs =
    variant === "answer" || variant === "pass" ? 2200 : variant === "save" ? 700 : 900;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl ring-1 ring-black/[0.05] dark:ring-white/[0.08] sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
        />
        <p className="text-center text-lg font-bold tracking-tight text-foreground">{title}</p>
        <p className="mt-2 text-center text-pretty text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
        <MockInterviewLoadingStepList steps={steps} running intervalMs={intervalMs} />
      </div>
    </div>
  );
}

function ratingText(rating: string): string {
  return rating === "GOOD" ? "좋음" : rating === "OK" ? "보통" : "미흡";
}
