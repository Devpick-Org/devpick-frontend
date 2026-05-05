"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { MyPageJobBookmark } from "@/types/myPage";

const EXPERIENCE_LABEL: Record<string, string> = {
  NEW: "신입",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
  ANY: "경력무관",
};

const EMPLOYMENT_LABEL: Record<string, string> = {
  FULL_TIME: "정규직",
  PART_TIME: "파트타임",
  CONTRACT: "계약직",
  INTERNSHIP: "인턴",
};

export function BookmarkedJobListItem({ bookmark }: { bookmark: MyPageJobBookmark }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const { jobPostingId, companyName, companyLogo, title, experienceLevel, employmentType, location, deadline, techStack } = bookmark;

  const hasLogo = Boolean(companyLogo?.trim()) && !logoFailed;
  const companyInitial = (companyName?.trim()?.[0] ?? "회").toUpperCase();
  const deadlineLabel =
    deadline === "채용 시 마감" ? "채용 시 마감" : deadline ? `~${formatDate(deadline)}` : null;

  return (
    <Link
      href={`/jobs/${jobPostingId}`}
      className="-mx-2 flex gap-4 px-2 py-3"
    >
      {/* 회사 로고 */}
      {hasLogo ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
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
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
          {companyInitial}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          {companyName}
        </span>
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {title}
        </p>
        <span className="text-xs text-muted-foreground">
          {[EXPERIENCE_LABEL[experienceLevel], EMPLOYMENT_LABEL[employmentType], location, deadlineLabel].filter(Boolean).join(" · ")}
        </span>
        {techStack.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {techStack.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                +{techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
