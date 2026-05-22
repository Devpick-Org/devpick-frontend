"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { useAuthStore } from "@/store/auth.store";
import { formatResetsAt } from "@/lib/utils";

interface ResumeSkillGapDetailProps {
  jobId: string | null;
  companyName: string;
  jobTitle: string;
  matchScore: number;
}

export function ResumeSkillGapDetail({
  jobId,
  companyName,
  jobTitle,
  matchScore,
}: ResumeSkillGapDetailProps) {
  const skillBoostLimits = useAuthStore((s) => s.user?.limits?.skillBoostWeekly);
  const exhausted = skillBoostLimits?.remaining === 0;
  const unlimited = skillBoostLimits?.remaining === -1;
  const limitsLabel = (() => {
    if (!skillBoostLimits) return null;
    if (unlimited) return "부족 역량 분석 무제한";
    if (exhausted)
      return `부족 역량 분석: 이번 주 횟수를 모두 사용했어요 · ${formatResetsAt(skillBoostLimits.resetsAt)} 초기화`;
    return `부족 역량 분석: 이번 주 ${skillBoostLimits.remaining}회 남음`;
  })();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["job-skill-gap", jobId],
    queryFn: () => jobsEndpoints.getSkillGap(jobId!),
    enabled: !!jobId,
  });

  if (!jobId) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl bg-muted/30 text-sm font-medium text-muted-foreground">
        공고를 선택해 주세요
      </div>
    );
  }

  const header = (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{companyName}</p>
        <h3 className="mt-0.5 text-base font-bold text-foreground">{jobTitle}</h3>
        {matchScore > 0 ? (
          <p className="mt-1 text-xs font-semibold text-primary">매칭 {matchScore}%</p>
        ) : (
          <p className="mt-1 text-xs font-medium text-muted-foreground">매칭 —</p>
        )}
      </div>
      {limitsLabel && (
        <span className={`shrink-0 text-xs font-medium ${exhausted ? "text-destructive" : "text-muted-foreground"}`}>
          {limitsLabel}
        </span>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0">
        {header}
        <div className="flex items-center gap-2.5 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          불러오는 중...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-0">
        {header}
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          불러오지 못했습니다
        </div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="flex flex-col gap-0">
        {header}
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            아직 역량 분석이 없어요
          </p>
          <Link
            href={`/jobs/${jobId}`}
            className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
          >
            채용 상세에서 생성하기 →
          </Link>
        </div>
      </div>
    );
  }

  const roadmap = data?.roadmap ?? [];
  const contents = data?.contents ?? [];

  if (roadmap.length === 0 && contents.length === 0) {
    return (
      <div className="flex flex-col gap-0">
        {header}
        <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
          이력서 기술 스택이 이 공고 요구사항을 충분히 충족하고 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {header}
      <div className="flex flex-col gap-6 pt-5">
        {roadmap.length > 0 && (
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
                  {c.preview && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.preview}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
