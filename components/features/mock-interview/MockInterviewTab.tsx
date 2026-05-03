"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/api/extractApiError";
import {
  mockInterviewsEndpoints,
  type MockInterviewSessionListItemApi,
} from "@/lib/api/endpoints/mock-interviews";
import { cn } from "@/lib/utils";
import { MockInterviewSetup } from "./MockInterviewSetup";
import { MockInterviewRoom } from "./MockInterviewRoom";
import { MockInterviewResult } from "./MockInterviewResult";

interface MockInterviewTabProps {
  hasResume: boolean;
}

type View =
  | { kind: "list" }
  | { kind: "setup" }
  | { kind: "session"; sessionId: string };

const PHASE_LABEL: Record<string, string> = {
  WARM_UP: "WARM-UP",
  PROJECT: "PROJECT",
  DOMAIN: "DOMAIN",
  CS_INFRA: "CS & INFRA",
  BEHAVIORAL: "BEHAVIORAL",
};

const STATUS_TONE: Record<string, string> = {
  IN_PROGRESS: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  COMPLETED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  EARLY_FINISHED: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
  EARLY_FINISHED: "조기 종료",
};

export function MockInterviewTab({ hasResume }: MockInterviewTabProps) {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");
  const [view, setView] = useState<View>(() =>
    sessionParam ? { kind: "session", sessionId: sessionParam } : { kind: "list" },
  );

  useEffect(() => {
    if (!sessionParam) return;
    const id = window.setTimeout(() => {
      setView((prev) => {
        if (prev.kind === "session" && prev.sessionId === sessionParam) {
          return prev;
        }
        return { kind: "session", sessionId: sessionParam };
      });
    }, 0);
    return () => window.clearTimeout(id);
  }, [sessionParam]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mock-interview-list"],
    queryFn: mockInterviewsEndpoints.list,
  });

  const sessions = useMemo(() => data?.sessions ?? [], [data]);
  const max = data?.max ?? 20;

  const { data: activeSession, isLoading: isLoadingSession } = useQuery({
    queryKey: ["mock-interview-session", view.kind === "session" ? view.sessionId : null],
    queryFn: () =>
      view.kind === "session"
        ? mockInterviewsEndpoints.get(view.sessionId)
        : Promise.resolve(null),
    enabled: view.kind === "session",
  });

  const startMutation = useMutation({
    mutationFn: (body: { jobTitle: string; companyName: string; modelKey: string; jobCategory: string; rawJdText: string }) =>
      mockInterviewsEndpoints.startFromJd({
        modelKey: body.modelKey,
        mode: "FULL",
        jobTitle: body.jobTitle,
        companyName: body.companyName,
        jobCategory: body.jobCategory,
        rawJdText: body.rawJdText,
      }),
    onSuccess: (session) => {
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      qc.setQueryData(["mock-interview-session", session.id], session);
      setView({ kind: "session", sessionId: session.id });
    },
    onError: (e) => {
      const { message, code } = extractApiError(e);
      if (code === "RESUME_001") {
        toast.error("먼저 마스터 이력서를 작성해 주세요.");
        return;
      }
      toast.error(message ?? "모의면접 시작에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => mockInterviewsEndpoints.delete(sessionId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      toast.success("모의면접 기록을 삭제했어요.");
    },
  });

  const previousCompletedSession = useMemo(() => {
    if (!activeSession || activeSession.status !== "COMPLETED") return null;
    const others = sessions
      .filter(
        (s) =>
          s.id !== activeSession.id &&
          s.status === "COMPLETED" &&
          s.jobTitle === activeSession.jobTitle &&
          s.companyName === activeSession.companyName,
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return others[0]?.id ?? null;
  }, [activeSession, sessions]);

  const previousSessionQuery = useQuery({
    queryKey: ["mock-interview-session-prev", previousCompletedSession],
    queryFn: () =>
      previousCompletedSession
        ? mockInterviewsEndpoints.get(previousCompletedSession)
        : Promise.resolve(null),
    enabled: previousCompletedSession != null,
  });

  if (!hasResume) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card px-5 py-5">
        <p className="text-sm font-semibold text-foreground">먼저 마스터 이력서가 필요해요.</p>
        <p className="text-sm text-muted-foreground">
          이력서를 등록하면 채팅형 모의면접을 시작할 수 있어요. JD 본문을 함께 입력하면 회사
          맞춤 질문이 만들어져요.
        </p>
        <Link
          href="/my-resume"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          이력서 작성하러 가기
        </Link>
      </div>
    );
  }

  if (view.kind === "setup") {
    return (
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={() => setView({ kind: "list" })}
          className="w-fit text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← 목록으로 돌아가기
        </button>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-1 text-lg font-bold text-foreground">새 모의면접 설정</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            JD를 그대로 붙여 넣거나, 회사명·직무명만 입력해도 시작할 수 있어요.
          </p>
          <MockInterviewSetup
            variant="JD"
            submitting={startMutation.isPending}
            hasResume={hasResume}
            onSubmit={(values) =>
              startMutation.mutate({
                jobTitle: values.jobTitle ?? "",
                companyName: values.companyName ?? "",
                modelKey: values.modelKey,
                jobCategory: values.jobCategory ?? "FRONTEND",
                rawJdText: values.rawJdText ?? "",
              })
            }
          />
        </div>
      </div>
    );
  }

  if (view.kind === "session") {
    if (isLoadingSession || !activeSession) {
      return (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[360px] w-full rounded-2xl" />
        </div>
      );
    }
    if (activeSession.status === "IN_PROGRESS") {
      return (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setView({ kind: "list" })}
            className="w-fit text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← 모의면접 목록으로
          </button>
          <MockInterviewRoom
            session={activeSession}
            onSessionUpdate={(s) =>
              qc.setQueryData(["mock-interview-session", activeSession.id], s)
            }
            onCompleted={(s) =>
              qc.setQueryData(["mock-interview-session", activeSession.id], s)
            }
            onSavedExit={() => setView({ kind: "list" })}
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setView({ kind: "list" })}
          className="w-fit text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← 모의면접 목록으로
        </button>
        <MockInterviewResult
          session={activeSession}
          previous={
            activeSession.status === "COMPLETED"
              ? previousSessionQuery.data ?? null
              : null
          }
          onRestart={() => setView({ kind: "setup" })}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Mock Interview
          </p>
          <h2 className="text-lg font-bold text-foreground">채팅형 AI 모의면접</h2>
          <p className="text-sm text-muted-foreground">
            15문항 5페이즈 구조(WARM-UP 2 · PROJECT 4 · 직무 4 · CS &amp; INFRA 4 · BEHAVIORAL 1).
            패스, 저장 후 나가기, 여기서 마치기를 모두 지원해요. 저장은 최대 {max}개까지.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView({ kind: "setup" })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 새 모의면접
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-[88px] w-full rounded-xl" />
          <Skeleton className="h-[88px] w-full rounded-xl" />
          <Skeleton className="h-[88px] w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-5">
          <p className="text-sm font-semibold text-destructive">목록을 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-xs font-medium text-destructive hover:underline"
          >
            다시 시도
          </button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center text-sm text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">아직 진행한 모의면접이 없어요.</p>
          <p>새 모의면접을 시작해 보세요. 결과는 마크다운으로도 받아 갈 수 있어요.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <SessionCard
                item={s}
                onOpen={() => setView({ kind: "session", sessionId: s.id })}
                onDelete={() => deleteMutation.mutate(s.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        저장 한도 {max}개를 넘으면 가장 오래된 기록부터 자동 삭제돼요. PDF는 저장하지 않으며,
        AI 호출 사용량은 본인의 Claude 구독 한도에서 차감돼요(면접 1회 약 20~35회 호출).
      </p>
    </div>
  );
}

function SessionCard({
  item,
  onOpen,
  onDelete,
}: {
  item: MockInterviewSessionListItemApi;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left"
      >
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            STATUS_TONE[item.status] ?? "bg-muted text-foreground",
          )}
        >
          {STATUS_LABEL[item.status] ?? item.status}
        </span>
        <p className="text-sm font-semibold text-foreground">
          {item.companyName || "직접 입력 JD"} · {item.jobTitle}
        </p>
        <p className="text-xs text-muted-foreground">
          진행 {item.answeredCount}/{item.totalQuestions} ·{" "}
          {PHASE_LABEL[item.phase] ?? item.phase} · 모델 {item.modelKey}
          {item.overallScore != null && ` · 종합 ${item.overallScore}`}
        </p>
        {item.status === "IN_PROGRESS" && (
          <ProgressBar
            value={item.answeredCount}
            total={item.totalQuestions}
          />
        )}
      </button>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="hidden sm:inline">
          {new Date(item.updatedAt).toLocaleString("ko-KR")}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 font-medium hover:bg-muted/40"
          aria-label="모의면접 삭제"
        >
          <Trash2 className="h-3.5 w-3.5" /> 삭제
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const ratio = Math.max(0, Math.min(1, total > 0 ? value / total : 0));
  return (
    <div className="mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
      <div
        className="h-full bg-amber-500"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

