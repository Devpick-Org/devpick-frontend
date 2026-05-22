import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedAnalysisItemApi } from "@/lib/api/endpoints/jobs";

interface ResumeQAJobListProps {
  items: SavedAnalysisItemApi[];
  selectedJobId: string | null;
  selectedView: "qa" | "skillgap";
  onSelect: (jobId: string, view: "qa" | "skillgap") => void;
}

export function ResumeQAJobList({
  items,
  selectedJobId,
  selectedView,
  onSelect,
}: ResumeQAJobListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl bg-muted/30 text-sm font-medium text-muted-foreground">
        저장된 분석 결과가 없습니다
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.jobId}>
          <div
            className={cn(
              "relative w-full rounded-xl px-4 py-3.5 text-left transition-colors",
              selectedJobId === item.jobId ? "bg-primary/10" : "bg-muted/60",
            )}
          >
            <Link
              href={`/jobs/${item.jobId}`}
              className={cn(
                "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
                selectedJobId === item.jobId
                  ? "hover:bg-primary/20"
                  : "hover:bg-muted",
              )}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <p className="text-sm font-bold text-foreground">
              {item.companyName}
            </p>
            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
              {item.jobTitle}
            </p>
            {item.matchScore > 0 ? (
              <p className="mt-2 text-xs font-semibold text-primary">
                매칭 {item.matchScore}%
              </p>
            ) : (
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                매칭 —
              </p>
            )}
            <div className="mt-2.5 flex gap-3">
              <button
                type="button"
                disabled={!item.hasInterviewQa}
                onClick={() => onSelect(item.jobId, "qa")}
                className={cn(
                  "border-b-2 pb-0.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer",
                  selectedJobId === item.jobId && selectedView === "qa"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                면접 Q&A
              </button>
              <button
                type="button"
                disabled={!item.hasSkillGap}
                onClick={() => onSelect(item.jobId, "skillgap")}
                className={cn(
                  "border-b-2 pb-0.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer",
                  selectedJobId === item.jobId && selectedView === "skillgap"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                부족 역량
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
