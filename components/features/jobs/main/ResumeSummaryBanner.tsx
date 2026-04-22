import Link from "next/link";
import { FileText } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface ResumeSummaryBannerProps {
  hasResume: boolean;
  resume?: ResumeData;
}

export function ResumeSummaryBanner({
  hasResume,
  resume,
}: ResumeSummaryBannerProps) {
  if (!hasResume) {
    return (
      <div className="flex flex-col gap-3 rounded-lg bg-muted/45 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
          <FileText className="h-4 w-4 shrink-0" />
          이력서를 등록하면 공고 매칭과 면접 Q&A를 활용할 수 있어요
        </div>
        <Link
          href="/my-resume"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          이력서 등록하기
        </Link>
      </div>
    );
  }

  if (!resume) return null;

  const { basicInfo, techStack } = resume;

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-muted/45 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            {basicInfo.name}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {basicInfo.jobTitle}
          </span>
          <span className="text-xs text-muted-foreground">
            {basicInfo.careerYears}년
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {techStack.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Link
        href="/my-resume"
        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        이력서 관리
      </Link>
    </div>
  );
}
