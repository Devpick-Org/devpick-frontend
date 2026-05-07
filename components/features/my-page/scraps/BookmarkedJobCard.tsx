"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import type { MyPageJobBookmark } from "@/types/myPage";


export function BookmarkedJobCard({ bookmark }: { bookmark: MyPageJobBookmark }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const { jobPostingId, companyName, companyLogo, title, location, deadline, techStack, matchScore } = bookmark;

  const hasLogo = Boolean(companyLogo?.trim()) && !logoFailed;
  const companyInitial = (companyName?.trim()?.[0] ?? "회").toUpperCase();
  const deadlineLabel =
    deadline === "채용 시 마감" ? "채용 시 마감" : deadline ? `~${formatDate(deadline)}` : null;
  return (
    <Link
      href={`/jobs/${jobPostingId}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card p-3"
    >
      <div className="flex gap-3">
        {/* 회사 로고 or 이니셜 박스 */}
        {hasLogo ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border">
            <Image
              fill
              src={companyLogo}
              alt={companyName}
              className="object-cover"
              unoptimized
              onError={() => setLogoFailed(true)}
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
            {companyInitial}
          </div>
        )}

        {/* 텍스트 */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-xs font-medium text-muted-foreground">
            {companyName}
          </span>
          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug tracking-[-0.01em] text-foreground">
            {title}
          </p>
        </div>
      </div>

      {matchScore !== undefined && (
        <div className="mt-2.5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">매칭 점수</span>
            <span className={cn(
              "text-[11px] font-bold",
              matchScore >= 80 ? "text-emerald-600" : matchScore >= 60 ? "text-primary" : "text-muted-foreground",
            )}>{matchScore}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                matchScore >= 80 ? "bg-emerald-500" : matchScore >= 60 ? "bg-primary" : "bg-muted-foreground/40",
              )}
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>
      )}

      <p className="mt-2 text-xs leading-tight text-muted-foreground">
        {[location, deadlineLabel].filter(Boolean).join(" · ")}
      </p>

      {techStack.length > 0 && (
        <div className="mt-auto pt-2.5 flex flex-wrap gap-1">
          {techStack.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{techStack.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
