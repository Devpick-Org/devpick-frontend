import { Skeleton } from "@/components/ui/skeleton";

interface HomeCollectionSummarySectionProps {
  summary: string;
  isLoading: boolean;
  rangeLabel: string;
}

export function HomeCollectionSummarySection({
  summary,
  isLoading,
  rangeLabel,
}: HomeCollectionSummarySectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-md font-semibold text-foreground">
        {rangeLabel} 수집된 기술 블로그 동향
      </h2>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-10/12 rounded" />
          <Skeleton className="h-3.5 w-9/12 rounded" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-foreground">{summary}</p>
      )}
    </section>
  );
}
