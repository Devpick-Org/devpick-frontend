"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { extractApiError } from "@/lib/api/extractApiError";
import {
  updateJobBookmarkCache,
  invalidateJobBookmarkQueries,
} from "@/lib/jobs/updateJobBookmarkCache";
import type { JobDetail } from "@/types/jobs";
import {
  JOB_CATEGORY_LABEL,
  EXPERIENCE_LEVEL_LABEL,
} from "../main/jobs.constants";

interface JobDetailHeaderProps {
  job: JobDetail;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const qc = useQueryClient();
  const bookmarked = job.bookmarked ?? false;
  const [logoFailed, setLogoFailed] = useState(false);
  const companyInitial = (job.companyName?.trim()?.[0] ?? "회").toUpperCase();
  const hasLogo = Boolean(job.companyLogo?.trim()) && !logoFailed;
  const expired = job.postingStatus === "EXPIRED";

  const toggleBookmark = useMutation({
    mutationFn: (wasBookmarked: boolean) =>
      wasBookmarked
        ? jobsEndpoints.unbookmark(job.id)
        : jobsEndpoints.bookmark(job.id),
    onMutate: async (wasBookmarked) => {
      await qc.cancelQueries({ queryKey: ["job-detail", job.id] });
      const previous = qc.getQueryData<JobDetail>(["job-detail", job.id]);
      updateJobBookmarkCache(qc, job.id, !wasBookmarked);
      return { previous };
    },
    onError: (e, _vars, context) => {
      qc.setQueryData(["job-detail", job.id], context?.previous);
      invalidateJobBookmarkQueries(qc, job.id);
      const { message } = extractApiError(e);
      toast.error(message ?? "북마크 처리에 실패했습니다.");
    },
    onSettled: () => invalidateJobBookmarkQueries(qc, job.id),
  });

  const deadlineLabel =
    job.deadline?.trim() &&
    (job.deadline === "채용 시 마감"
      ? "채용 시 마감"
      : `${formatDate(job.deadline)}까지`);

  const infoRows: Array<{ label: string; value: string }> = [
    { label: "직무", value: JOB_CATEGORY_LABEL[job.jobCategory] },
    { label: "경력", value: EXPERIENCE_LEVEL_LABEL[job.experienceLevel] },
    { label: "연봉", value: job.salary },
    ...(deadlineLabel
      ? [{ label: "마감일", value: deadlineLabel }]
      : []),
    { label: "근무지", value: job.location },
  ];

  return (
    <div className="flex flex-col gap-5 border-b border-border pb-6">
      {/* ← 공고 목록 */}
      <Link
        href="/jobs"
        className="group/back mb-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        공고 목록으로
      </Link>

      {/* 회사 로고 + 회사명 + 스크랩 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-xs font-bold text-muted-foreground">
            {hasLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName}
                fill
                className="object-cover"
                unoptimized
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span aria-hidden>{companyInitial}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {job.companyName}
            </p>
            {expired && (
              <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                마감됨
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
              if (!toggleBookmark.isPending) toggleBookmark.mutate(bookmarked);
            }}
          disabled={toggleBookmark.isPending}
          aria-label={bookmarked ? "스크랩 해제" : "스크랩"}
          className={cn(
            "shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors",
            bookmarked
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Bookmark
            className="h-5 w-5"
            fill={bookmarked ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* 공고 제목 */}
      <h1 className="text-xl font-bold leading-snug tracking-[-0.01em] text-foreground">
        {job.title}
      </h1>

      {/* 기본 정보 + 원문 보기 */}
      <div className="flex items-end justify-between gap-4">
        <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-3">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-[11px] font-medium text-muted-foreground">
                {label}
              </dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <a
          href={job.applyUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          원문 보기
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
