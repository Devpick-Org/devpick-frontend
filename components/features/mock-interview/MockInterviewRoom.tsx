"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
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

interface MockInterviewRoomProps {
  session: MockInterviewSessionDetailApi;
  onSessionUpdate: (session: MockInterviewSessionDetailApi) => void;
  onCompleted: (session: MockInterviewSessionDetailApi) => void;
  onSavedExit: () => void;
}

const PHASE_LABEL: Record<string, string> = {
  WARM_UP: "WARM-UP",
  PROJECT: "PROJECT",
  DOMAIN: "DOMAIN",
  CS_INFRA: "CS & INFRA",
  BEHAVIORAL: "BEHAVIORAL",
};

const PHASE_RANGE: { phase: string; from: number; to: number }[] = [
  { phase: "WARM_UP", from: 1, to: 2 },
  { phase: "PROJECT", from: 3, to: 6 },
  { phase: "DOMAIN", from: 7, to: 10 },
  { phase: "CS_INFRA", from: 11, to: 14 },
  { phase: "BEHAVIORAL", from: 15, to: 15 },
];

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
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        질문 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const phaseLabel = PHASE_LABEL[currentQuestion.phase] ?? currentQuestion.phase;
  const isBusy = answerMutation.isPending || passMutation.isPending;

  const handleSubmit = () => {
    const content = draft.trim();
    if (!content) {
      toast.error("답변 내용을 입력해 주세요.");
      return;
    }
    answerMutation.mutate(content);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4">
        <PhaseBar currentNo={currentQuestion.questionNo} />

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Q{currentQuestion.questionNo} / {session.totalQuestions}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-foreground">
              {phaseLabel}
            </span>
            <span>{currentQuestion.topic}</span>
            {currentQuestion.jdOnlyKeyword && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                JD 갭 키워드
              </span>
            )}
          </div>
          <p className="whitespace-pre-wrap text-base font-medium leading-relaxed text-foreground">
            {lastPrompt?.content ?? currentQuestion.prompt}
          </p>
          {lastEvaluation?.rating && lastPrompt?.type !== "QUESTION" && (
            <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              직전 답변 평가: <strong>{ratingText(lastEvaluation.rating)}</strong>
              {lastEvaluation.metadata && typeof lastEvaluation.metadata.evaluatorComment === "string" && (
                <>
                  {" — "}
                  {String(lastEvaluation.metadata.evaluatorComment)}
                </>
              )}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isBusy) handleSubmit();
              }
            }}
            placeholder="답변을 입력하세요. Enter로 전송, Shift+Enter로 줄바꿈."
            rows={6}
            disabled={isBusy}
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm leading-relaxed disabled:opacity-60"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => passMutation.mutate()}
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SkipForward className="h-3.5 w-3.5" /> 질문 패스
              </button>
              <button
                type="button"
                onClick={() => saveExitMutation.mutate()}
                disabled={saveExitMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveExitMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5" />
                )}
                저장 후 나가기
              </button>
              <button
                type="button"
                onClick={() => finishEarlyMutation.mutate()}
                disabled={finishEarlyMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 px-3 py-1.5 font-medium text-rose-600 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {finishEarlyMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Flag className="h-3.5 w-3.5" />
                )}
                여기서 마치기
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isBusy || !draft.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CornerDownLeft className="h-4 w-4" />
              )}
              답변 보내기
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">실전 팁</p>
          <ul className="grid gap-1 sm:grid-cols-2">
            <li>결론 → 기술 스택 → 디테일 순서로 답변하면 꼬리질문이 더 생산적이에요.</li>
            <li>모르는 질문은 과감히 패스하고, 아는 질문에 집중하세요.</li>
            <li>JD 본문을 입력하면 회사 맞춤형 질문이 나와요.</li>
            <li>이전 면접 결과와 비교해 점수 변화를 확인할 수 있어요.</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">대화 로그</p>
          <span className="text-xs text-muted-foreground">
            진행 {session.answeredCount}/{session.totalQuestions}
          </span>
        </div>
        <MockInterviewConversationLog session={session} />
        <p className="text-xs text-muted-foreground">
          대화 로그는 실시간으로 저장돼요. 새로고침해도 이어서 진행할 수 있어요.
        </p>
      </div>
    </div>
  );
}

function PhaseBar({ currentNo }: { currentNo: number }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border bg-card px-3 py-2 text-xs">
      {PHASE_RANGE.map((p, i) => {
        const active = currentNo >= p.from && currentNo <= p.to;
        const done = currentNo > p.to;
        return (
          <div key={p.phase} className="flex items-center gap-2 whitespace-nowrap">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-semibold",
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-muted text-foreground"
                    : "bg-card text-muted-foreground",
              )}
            >
              {PHASE_LABEL[p.phase]} · Q{p.from}
              {p.from !== p.to ? `-${p.to}` : ""}
            </span>
            {i < PHASE_RANGE.length - 1 && (
              <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ratingText(rating: string): string {
  return rating === "GOOD" ? "좋음" : rating === "OK" ? "보통" : "미흡";
}
