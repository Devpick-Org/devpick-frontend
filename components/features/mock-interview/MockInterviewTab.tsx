"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Info,
  ListChecks,
  MessageSquare,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
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

const MOCK_PHASE_CHIPS = [
  { short: "WARM-UP", detail: "2문항", span: "Q1–2" },
  { short: "PROJECT", detail: "4문항", span: "Q3–6" },
  { short: "직무", detail: "4문항", span: "Q7–10" },
  { short: "CS · INFRA", detail: "4문항", span: "Q11–14" },
  { short: "BEHAVIORAL", detail: "1문항", span: "Q15" },
] as const;

const MOCK_FEATURE_ROWS = [
  { text: "질문 패스 — 모르는 문항은 건너뛰고, 결과에서 모범 답안을 볼 수 있어요." },
  { text: "저장 후 나가기 — 진행 상태가 서버에 남아서 이후에 이어하기 할 수 있어요." },
  { text: "여기서 마치기 — 조기 종료 시 진행률에 맞춰 점수를 보정해 드려요." },
] as const;

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

  const mockStartError = (e: unknown) => {
    const { message, code } = extractApiError(e);
    if (code === "RESUME_001") {
      toast.error("먼저 마스터 이력서를 작성해 주세요.");
      return;
    }
    toast.error(message ?? "모의면접 시작에 실패했습니다.");
  };

  const startFromJdMutation = useMutation({
    mutationFn: (body: {
      jobTitle: string;
      companyName: string;
      modelKey: string;
      jobCategory: string;
      rawJdText: string;
    }) =>
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
    onError: mockStartError,
  });

  const startFromJobMutation = useMutation({
    mutationFn: (body: { jobId: string; modelKey: string }) =>
      mockInterviewsEndpoints.startFromJob(body.jobId, {
        modelKey: body.modelKey,
        mode: "FULL",
      }),
    onSuccess: (session) => {
      void qc.invalidateQueries({ queryKey: ["mock-interview-list"] });
      qc.setQueryData(["mock-interview-session", session.id], session);
      setView({ kind: "session", sessionId: session.id });
    },
    onError: mockStartError,
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
            크롤링해 둔 채용 공고를 검색해서 고르면 JD가 자동 반영돼요. 목록에 없을 때만 직접 입력할 수 있어요.
          </p>
          <MockInterviewSetup
            variant="JD"
            submitting={startFromJdMutation.isPending || startFromJobMutation.isPending}
            hasResume={hasResume}
            onSubmit={(values) => {
              if (values.jobId) {
                startFromJobMutation.mutate({
                  jobId: values.jobId,
                  modelKey: values.modelKey,
                });
                return;
              }
              startFromJdMutation.mutate({
                jobTitle: values.jobTitle ?? "",
                companyName: values.companyName ?? "",
                modelKey: values.modelKey,
                jobCategory: values.jobCategory ?? "FRONTEND",
                rawJdText: values.rawJdText ?? "",
              });
            }}
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
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_320px_at_100%_0%,var(--color-primary)_0%,transparent_55%)] opacity-[0.11] dark:opacity-[0.14]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-muted/40" />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Mock Interview
                </p>
                <h2 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  채팅형 AI 모의면접
                </h2>
                <p className="text-pretty text-sm text-muted-foreground">
                  고정 플랜으로 15개 질문을 채팅처럼 이어 가요. 아래 순서와 개수 그대로 진행됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView({ kind: "setup" })}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-[transform,box-shadow,background-color] hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] lg:hidden"
              >
                <Plus className="size-4" aria-hidden /> 새 모의면접
              </button>
            </header>

            <section className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  5 페이즈
                </h3>
                <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  총 15문항
                </span>
                <span className="text-xs text-muted-foreground">저장 세션 최대 {max}개</span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {MOCK_PHASE_CHIPS.map((row) => (
                  <li
                    key={row.short}
                    className={cn(
                      "inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-2xl border border-border/80 bg-background/80 px-3 py-2 text-xs backdrop-blur-sm transition-colors",
                      "hover:border-primary/30 hover:bg-primary/[0.04]",
                    )}
                  >
                    <span className="font-semibold text-foreground">{row.short}</span>
                    <span className="tabular-nums text-muted-foreground">{row.detail}</span>
                    <span className="rounded-md bg-muted/80 px-1.5 py-0 text-[10px] font-medium text-muted-foreground">
                      {row.span}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <ListChecks className="size-3.5 text-primary" aria-hidden />
                제공 기능
              </h3>
              <ul className="grid gap-2 sm:grid-cols-1">
                {MOCK_FEATURE_ROWS.map((row) => (
                  <li
                    key={row.text}
                    className="relative rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 pl-[1.125rem] text-sm leading-snug text-muted-foreground backdrop-blur-sm before:absolute before:left-3 before:top-[0.9em] before:size-1 before:rounded-full before:bg-primary/70 before:content-[''] sm:pl-4 sm:before:left-3.5"
                  >
                    {row.text}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="flex min-h-[11rem] flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-muted/25 p-4 shadow-inner backdrop-blur-md sm:p-5 dark:bg-muted/15">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <MessageSquare className="size-4" aria-hidden />
                </span>
                지금 바로 시작
              </div>
              <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                채용 공고를 붙여 넣거나 기본 JD로 시작할 수 있어요. 결과는 요약과 피드백으로 확인합니다.
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {MOCK_PHASE_CHIPS.map((row, i) => (
                  <span
                    key={row.short}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground"
                    title={`${row.short} ${row.detail}`}
                  >
                    <span className="font-semibold text-primary/90">{i + 1}</span>
                    <span>{row.detail.replace("문항", "")}</span>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setView({ kind: "setup" })}
              className="hidden w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-[transform,box-shadow,background-color] hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] lg:inline-flex"
            >
              <Plus className="size-4" aria-hidden /> 새 모의면접
            </button>
          </aside>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-[88px] w-full rounded-xl" />
          <Skeleton className="h-[88px] w-full rounded-xl" />
          <Skeleton className="h-[88px] w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="relative overflow-hidden rounded-3xl border border-destructive/20 bg-card shadow-sm ring-1 ring-destructive/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-destructive/[0.08] via-transparent to-muted/25"
          />
          <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/12 text-destructive ring-1 ring-destructive/20">
                <AlertCircle className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1.5">
                <p className="text-sm font-semibold text-foreground">
                  목록을 불러오지 못했습니다
                </p>
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  네트워크 탭에서 404면 모의면접 API Jar·DB 마이그레이션 배포 여부를, 401이면 로그인·토큰을 확인해 주세요. 잠시 뒤
                  아래 버튼으로 다시 시도할 수 있어요.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-destructive/25 bg-background/90 px-4 text-sm font-semibold text-destructive shadow-sm backdrop-blur-sm transition-[transform,box-shadow,background-color] hover:bg-destructive/10 hover:shadow-md active:scale-[0.98] sm:h-10 sm:w-auto sm:self-center"
            >
              <RefreshCw className="size-4" aria-hidden /> 다시 시도
            </button>
          </div>
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

      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-muted/15 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm dark:ring-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent"
        />
        <div className="relative flex gap-3.5 px-4 py-4 sm:px-5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Info className="size-[18px]" aria-hidden />
          </span>
          <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
            저장 한도 <span className="font-semibold text-foreground">{max}개</span>를 넘으면 가장 오래된 기록부터 자동 삭제돼요. PDF는 저장하지 않으며,
            AI 호출은 본인 Claude 구독 한도에서 차감돼요(면접 1회 약 20~35회 호출).
          </p>
        </div>
      </div>
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

