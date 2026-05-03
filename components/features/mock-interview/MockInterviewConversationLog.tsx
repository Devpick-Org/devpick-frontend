"use client";

import { useEffect, useRef } from "react";
import type {
  MockInterviewSessionDetailApi,
  MockInterviewTurnApi,
} from "@/lib/api/endpoints/mock-interviews";
import { cn } from "@/lib/utils";
import { phaseTitleKo } from "./phaseLabels";

interface MockInterviewConversationLogProps {
  session: MockInterviewSessionDetailApi;
  className?: string;
  scrollOnUpdate?: boolean;
}

export function MockInterviewConversationLog({
  session,
  className,
  scrollOnUpdate = true,
}: MockInterviewConversationLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollOnUpdate) return;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.turns.length, scrollOnUpdate]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex max-h-[60vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-border/70 bg-card/70 p-4 shadow-inner ring-1 ring-black/[0.02] dark:ring-white/[0.04]",
        className,
      )}
    >
      {session.turns.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          첫 질문이 곧 표시됩니다.
        </p>
      ) : (
        session.turns.map((turn) => (
          <ConversationLogTurn key={`${turn.orderNo}`} turn={turn} />
        ))
      )}
    </div>
  );
}

function ConversationLogTurn({ turn }: { turn: MockInterviewTurnApi }) {
  const { tone, badge } = turnStyle(turn);
  const phase = phaseTitleKo(turn.phase);
  return (
    <div className={cn("rounded-xl border px-3 py-2.5", tone)}>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-muted-foreground">
        <span className="tabular-nums">
          Q{turn.questionNo} · {phase}
        </span>
        <span>{badge}</span>
      </div>
      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">
        {turn.content}
      </p>
      {turn.rating && (
        <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          평가: {ratingLabel(turn.rating)}
        </span>
      )}
    </div>
  );
}

function turnStyle(turn: MockInterviewTurnApi): { tone: string; badge: string } {
  switch (turn.type) {
    case "QUESTION":
      return { tone: "border-border bg-muted/30", badge: "질문" };
    case "ANSWER":
      return { tone: "border-primary/30 bg-primary/5", badge: "내 답변" };
    case "FOLLOW_UP_QUESTION":
      return {
        tone: "border-cyan-500/30 bg-cyan-500/5",
        badge: "꼬리질문",
      };
    case "FOLLOW_UP_ANSWER":
      return {
        tone: "border-cyan-400/25 bg-cyan-400/5",
        badge: "꼬리질문 답변",
      };
    case "RETRY_REQUEST":
      return { tone: "border-rose-500/30 bg-rose-500/5", badge: "재답변 요청" };
    case "RETRY_ANSWER":
      return { tone: "border-rose-400/25 bg-rose-400/5", badge: "재답변" };
    case "PASS":
      return { tone: "border-amber-500/30 bg-amber-500/5", badge: "패스" };
    default:
      return { tone: "border-border bg-card", badge: turn.type };
  }
}

function ratingLabel(rating: string): string {
  return rating === "GOOD" ? "좋음" : rating === "OK" ? "보통" : "미흡";
}
