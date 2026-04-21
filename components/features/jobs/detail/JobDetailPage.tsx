"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJobDetailById } from "@/lib/mock/jobs";
import { JobDetailHeader } from "./JobDetailHeader";
import { JobDetailSection } from "./JobDetailSection";
import { JobMatchSection } from "./JobMatchSection";
import { JobQASection } from "./JobQASection";

interface JobDetailPageProps {
  id: string;
}

function JobDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        {/* 메인 콘텐츠 */}
        <main className="flex flex-col gap-8 pb-12">
          {/* Header skeleton */}
          <div className="flex flex-col gap-5 border-b border-border pb-6">
            <Skeleton className="mt-6 h-5 w-24 rounded" />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>

            <Skeleton className="h-7 w-2/3 rounded" />

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-10 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>

            <div className="flex justify-end -mt-16">
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>

          {/* 기술 스택 */}
          <div className="-mt-2 flex flex-col gap-3">
            <Skeleton className="h-5 w-20 rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </div>

          {/* 리스트형 섹션들 */}
          {["주요 업무", "자격 요건", "우대 사항"].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-5 w-20 rounded" />
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <Skeleton className="h-1.5 w-1.5 rounded-full" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 복지 혜택 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20 rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* 채용 절차 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-20 rounded" />
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-7 w-20 rounded-lg" />
                  {i < 3 && <Skeleton className="h-3.5 w-3.5 rounded" />}
                </div>
              ))}
            </div>
          </div>

          {/* Q&A 섹션 */}
          <div className="mt-3 border-t pt-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-28 rounded" />
              <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <Skeleton className="h-4 w-72 rounded" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        </main>

        {/* 오른쪽 매칭 점수 skeleton */}
        <aside className="lg:sticky lg:top-[9rem]">
          <div className="rounded-2xl border border-border p-5">
            <div className="flex flex-col gap-5">
              {/* 제목 */}
              <Skeleton className="h-5 w-24 rounded" />

              {/* 점수 영역 */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-20 rounded" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>

              {/* 그래프 or 바 */}
              <Skeleton className="h-3 w-full rounded" />

              {/* breakdown */}
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-3 w-8 rounded" />
                    </div>
                    <Skeleton className="h-2 w-full rounded" />
                  </div>
                ))}
              </div>

              {/* 설명 텍스트 */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function JobDetailPage({ id }: JobDetailPageProps) {
  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job-detail", id],
    queryFn: () => fetchJobDetailById(id),
  });

  if (isLoading) return <JobDetailSkeleton />;

  if (isError || !job) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-medium">공고를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        {/* 메인 콘텐츠 */}
        <main className="flex flex-col gap-8 pb-12">
          <JobDetailHeader job={job} />
          <div className="-mt-3">
            <JobDetailSection title="기술 스택">
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </JobDetailSection>
          </div>

          <JobDetailSection title="주요 업무">
            <ul className="space-y-2.5">
              {job.responsibilities.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </JobDetailSection>

          <JobDetailSection title="자격 요건">
            <ul className="space-y-2.5">
              {job.requirements.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </JobDetailSection>

          <JobDetailSection title="우대 사항">
            <ul className="space-y-2.5">
              {job.preferredQualifications.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </JobDetailSection>

          <JobDetailSection title="복지 혜택">
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </JobDetailSection>

          <JobDetailSection title="채용 절차">
            <div className="flex flex-wrap items-center gap-2">
              {job.hiringProcess.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex h-7 items-center gap-1.5 rounded-lg bg-primary/10 px-3">
                    <span className="text-[11px] font-semibold leading-none text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold leading-none text-primary">
                      {step}
                    </span>
                  </div>
                  {i < job.hiringProcess.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </JobDetailSection>

          <div className="mt-3 border-t pt-8">
            <JobQASection jobId={id} />
          </div>
        </main>

        {/* 매칭 점수 (데스크탑: sticky 사이드바) */}
        <aside className="lg:sticky lg:top-[9rem]">
          <JobMatchSection
            matchScore={job.matchScore}
            matchBreakdown={job.matchBreakdown}
          />
        </aside>
      </div>
    </div>
  );
}
