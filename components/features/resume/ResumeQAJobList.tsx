import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedQA } from "@/lib/mock/resume-qa";

interface ResumeQAJobListProps {
  items: SavedQA[];
  selectedJobId: string | null;
  onSelect: (jobId: string) => void;
}

export function ResumeQAJobList({
  items,
  selectedJobId,
  onSelect,
}: ResumeQAJobListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl bg-muted/30 text-sm text-muted-foreground font-medium">
        저장된 Q&A가 없습니다
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((qa) => (
        <li key={qa.jobId}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(qa.jobId)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(qa.jobId)}
            className={cn(
              "relative w-full rounded-xl px-4 py-3.5 text-left transition-colors cursor-pointer",
              selectedJobId === qa.jobId
                ? "bg-primary/10"
                : "bg-muted/60 hover:bg-muted/50",
            )}
          >
            <Link
              href={`/jobs/${qa.jobId}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
                selectedJobId === qa.jobId
                  ? "hover:bg-primary/20"
                  : "hover:bg-muted",
              )}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <p className=" text-sm font-bold text-foreground">
              {qa.companyName}
            </p>
            <p className="mt-0.5 truncate  text-xs font-medium text-muted-foreground">
              {qa.jobTitle}
            </p>
            <p className="mt-2 text-xs font-semibold text-primary">
              매칭 {qa.matchScore}%
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
