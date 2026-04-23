import { Skeleton } from "@/components/ui/skeleton";

interface HomeTopPostsSummarySectionProps {
  summary: string;
  isLoading: boolean;
  rangeLabel: string;
}

export function HomeTopPostsSummarySection({
  summary,
  isLoading,
  rangeLabel,
}: HomeTopPostsSummarySectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-md font-semibold text-foreground">
        {rangeLabel} 조회수 Top 5 동향
      </h2>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-11/12 rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-foreground">{summary}</p>
      )}
    </section>
  );
}
