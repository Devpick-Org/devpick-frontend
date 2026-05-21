"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { JobCategory } from "@/types/jobs";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { extractApiError } from "@/lib/api/extractApiError";
import { useAuthStore } from "@/store/auth.store";
import { formatResetsAt } from "@/lib/utils";
import { JOB_CATEGORY_LABEL } from "../main/jobs.constants";
import {
  JobAiProgressSteps,
  useProgressStepTicker,
} from "./JobAiProgressSteps";
import { JobDetailSection } from "./JobDetailSection";

interface JobSkillGapSectionProps {
  jobId: string;
  companyName?: string;
  jobTitle?: string;
  jobCategory?: JobCategory;
}

function ellipsize(s: string, maxLen: number): string {
  const t = s.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}

function buildSkillGapSteps(
  companyName: string,
  jobTitle: string,
  categoryLabel: string,
): readonly string[] {
  const co = companyName.trim() || "해당 회사";
  const title = ellipsize(jobTitle.trim() || "이 포지션", 36);
  const cat = categoryLabel || "직무";
  return [
    `${co} 「${title}」 필수 역량 요건을 분석하고 있어요`,
    `마스터 이력서 스킬과 공고 ${cat} 역량 요건을 비교하고 있어요`,
    `학습 로드맵과 추천 콘텐츠를 골라 정리하고 있어요`,
  ];
}

export function JobSkillGapSection({
  jobId,
  companyName = "",
  jobTitle = "",
  jobCategory,
}: JobSkillGapSectionProps) {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  const skillBoostLimits = useAuthStore((s) => s.user?.limits?.skillBoostWeekly);

  const {
    data: savedResult,
    isLoading: isLoadingSaved,
  } = useQuery({
    queryKey: ["job-skill-gap", jobId],
    queryFn: () => jobsEndpoints.getSkillGap(jobId),
  });

  const mutation = useMutation({
    mutationFn: () => jobsEndpoints.skillGap(jobId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["job-skill-gap", jobId] });
      authEndpoints.getMe().then(({ data }) => updateUser(data.data)).catch(() => {});
    },
    onError: (e) => {
      const { message } = extractApiError(e);
      toast.error(message ?? "부족 역량 추천을 불러오지 못했습니다.");
    },
  });

  const skillGapSteps = buildSkillGapSteps(
    companyName,
    jobTitle,
    jobCategory != null ? JOB_CATEGORY_LABEL[jobCategory] : "개발",
  );
  const skillGapActiveStep = useProgressStepTicker(
    mutation.isPending,
    skillGapSteps.length,
    1100,
    jobId,
  );

  const roadmap = savedResult?.roadmap ?? null;
  const contents = savedResult?.contents ?? [];
  const hasResult = (roadmap && roadmap.length > 0) || contents.length > 0;

  const exhausted = skillBoostLimits?.remaining === 0;
  const unlimited = skillBoostLimits?.remaining === -1;

  const limitsLabel = (() => {
    if (!skillBoostLimits) return null;
    if (unlimited) return "무제한";
    if (exhausted)
      return `이번 주 횟수를 모두 사용했어요 · ${formatResetsAt(skillBoostLimits.resetsAt)} 초기화`;
    return `이번 주 ${skillBoostLimits.remaining}회 남음`;
  })();

  return (
    <JobDetailSection
      title="부족 역량 보완"
      titleClassName="text-lg"
      titleSuffix={limitsLabel && (
        <span className={`text-xs font-medium ${exhausted ? "text-destructive" : "text-muted-foreground"}`}>
          {limitsLabel}
        </span>
      )}
      action={
        <button
          type="button"
          disabled={mutation.isPending || isLoadingSaved || exhausted}
          onClick={() => mutation.mutate()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          추천 받기
        </button>
      }
    >
      {isLoadingSaved && !mutation.isPending && (
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          불러오는 중...
        </div>
      )}

      {/* 한 번도 생성하지 않은 초기 상태 */}
      {!isLoadingSaved && savedResult === null && !mutation.isPending && (
        <p className="text-sm font-medium text-muted-foreground">
          필수 기술 대비 부족한 부분을 기준으로 학습 로드맵과 추천 콘텐츠를 받을 수 있어요.
        </p>
      )}

      {mutation.isPending && !hasResult && (
        <div className="rounded-lg bg-muted/50 px-4 py-3.5">
          <JobAiProgressSteps labels={skillGapSteps} activeStepIndex={skillGapActiveStep} />
        </div>
      )}

      {/* 생성했지만 보완할 역량이 없는 경우 */}
      {!mutation.isPending && savedResult !== null && savedResult !== undefined && !hasResult && (
        <p className="text-sm font-medium text-muted-foreground">
          이력서 기술 스택이 이 공고 요구사항을 충분히 충족하고 있어요. 추가로 보완할 역량이 없습니다.
        </p>
      )}

      {hasResult && (
        <div className="flex flex-col gap-6">
          {mutation.isPending && (
            <div className="rounded-lg bg-muted/50 px-4 py-3.5">
              <JobAiProgressSteps labels={skillGapSteps} activeStepIndex={skillGapActiveStep} />
            </div>
          )}

          {roadmap && roadmap.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-bold text-foreground">학습 로드맵</h4>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm font-medium text-foreground">
                {roadmap.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {contents.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-bold text-foreground">추천 콘텐츠</h4>
              <ul className="space-y-2">
                {contents.map((c) => (
                  <li key={c.id}>
                    <a
                      href={c.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      {c.title}
                    </a>
                    {c.preview ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.preview}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </JobDetailSection>
  );
}
