"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, MapPin, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, formatDate } from "@/lib/utils";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { extractApiError } from "@/lib/api/extractApiError";
import type { Job } from "@/types/jobs";
import { EXPERIENCE_LEVEL_LABEL, JOB_CATEGORY_LABEL } from "./jobs.constants";
import { toast } from "sonner";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const qc = useQueryClient();
  const bookmarked = job.bookmarked ?? false;
  const [logoFailed, setLogoFailed] = useState(false);
  const companyInitial = (job.companyName?.trim()?.[0] ?? "회").toUpperCase();
  const hasLogo = Boolean(job.companyLogo?.trim()) && !logoFailed;

  const toggleBookmark = useMutation({
    mutationFn: () =>
      bookmarked ? jobsEndpoints.unbookmark(job.id) : jobsEndpoints.bookmark(job.id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["jobs"] });
      void qc.invalidateQueries({ queryKey: ["job-detail", job.id] });
    },
    onError: (e) => {
      const { message } = extractApiError(e);
      toast.error(message ?? "북마크 처리에 실패했습니다.");
    },
  });

  const handleScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark.mutate();
  };

  const scoreColor =
    job.matchScore >= 80
      ? "text-emerald-600"
      : job.matchScore >= 60
        ? "text-primary"
        : "text-muted-foreground";

  const scoreBarColor =
    job.matchScore >= 80
      ? "bg-emerald-500"
      : job.matchScore >= 60
        ? "bg-primary"
        : "bg-muted-foreground/40";

  return (
    <Link href={`/jobs/${job.id}`} className="h-full">
      <article className="h-full flex flex-col bg-card p-5 border-b border-border cursor-pointer">
        {/* Header: 로고 + 회사명 + 고용형태 + 스크랩 */}
        <div className="mb-3 flex items-start justify-between gap-3">
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
              <p className="text-sm font-semibold text-foreground">
                {job.companyName}
              </p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {JOB_CATEGORY_LABEL[job.jobCategory]} |{" "}
                {EXPERIENCE_LEVEL_LABEL[job.experienceLevel]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleScrap}
            disabled={toggleBookmark.isPending}
            aria-label={bookmarked ? "스크랩 해제" : "스크랩"}
            className={cn(
              "shrink-0 rounded-lg p-1.5 transition-colors cursor-pointer",
              bookmarked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Bookmark
              className="h-4 w-4"
              fill={bookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* 공고 제목 */}
        <h3 className="mb-4 line-clamp-2 text-[15px] font-bold leading-snug tracking-[-0.01em] text-foreground">
          {job.title}
        </h3>

        {/* 매칭 점수 progress bar */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              매칭 점수
            </span>
            <span className={cn("text-xs font-bold", scoreColor)}>
              {job.postingStatus === "EXPIRED"
                ? "만료"
                : job.matchScore > 0
                  ? `${job.matchScore}%`
                  : "이력서 필요"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                scoreBarColor,
              )}
              style={{
                width:
                  job.postingStatus === "EXPIRED" || job.matchScore <= 0
                    ? "0%"
                    : `${job.matchScore}%`,
              }}
            />
          </div>
        </div>

        {/* matchedTags / missingTags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {job.matchedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 pt-1 pb-0.5 text-[11px] font-medium text-primary"
            >
              {tag}
            </span>
          ))}
          {job.missingTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 pt-1 pb-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 위치 + 마감일 */}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {!job.deadline?.trim()
              ? "마감일 미정"
              : job.deadline === "채용 시 마감"
                ? "채용 시 마감"
                : `${formatDate(job.deadline)}까지`}
          </span>
        </div>
      </article>
    </Link>
  );
}
