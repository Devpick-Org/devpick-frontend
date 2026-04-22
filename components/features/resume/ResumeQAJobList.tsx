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
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-border bg-muted/20 text-sm text-muted-foreground font-medium">
        저장된 Q&A가 없습니다
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((qa) => (
        <li key={qa.jobId}>
          <button
            type="button"
            onClick={() => onSelect(qa.jobId)}
            className={cn(
              "w-full rounded-xl px-4 py-3.5 text-left transition-colors cursor-pointer",
              selectedJobId === qa.jobId
                ? "bg-primary/10"
                : "bg-muted/60 hover:bg-muted/50",
            )}
          >
            <p className="text-sm font-bold text-foreground">
              {qa.companyName}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground font-medium">
              {qa.jobTitle}
            </p>
            <p className="mt-2 text-xs font-semibold text-primary">
              매칭 {qa.matchScore}%
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
