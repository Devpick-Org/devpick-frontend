"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import type { JobDetail } from "@/types/jobs";
import {
  JOB_CATEGORY_LABEL,
  EXPERIENCE_LEVEL_LABEL,
} from "../main/jobs.constants";

interface JobDetailHeaderProps {
  job: JobDetail;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const [scrapped, setScrapped] = useState(false);

  const deadlineLabel =
    job.deadline === "채용 시 마감"
      ? "채용 시 마감"
      : `${formatDate(job.deadline)}까지`;

  const infoRows = [
    { label: "직무", value: JOB_CATEGORY_LABEL[job.jobCategory] },
    { label: "경력", value: EXPERIENCE_LEVEL_LABEL[job.experienceLevel] },
    { label: "연봉", value: job.salary },
    { label: "마감일", value: deadlineLabel },
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
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={job.companyLogo}
              alt={job.companyName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {job.companyName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setScrapped((prev) => !prev)}
          aria-label={scrapped ? "스크랩 해제" : "스크랩"}
          className={cn(
            "shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors",
            scrapped
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Bookmark
            className="h-5 w-5"
            fill={scrapped ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* 공고 제목 */}
      <h1 className="text-xl font-bold leading-snug tracking-[-0.01em] text-foreground">
        {job.title}
      </h1>

      {/* 기본 정보 */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
        {infoRows.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="text-[11px] font-medium text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      {/* 지원하러 가기 */}
      <div className="flex justify-end -mt-16">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          지원하러 가기
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
