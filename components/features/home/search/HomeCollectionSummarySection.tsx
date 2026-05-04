import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
        <div className="text-sm leading-relaxed text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return <ul className="mt-2 flex flex-col gap-1.5">{children}</ul>;
              },
              li({ children }) {
                return (
                  <li className="flex gap-1.5">
                    <span className="mt-1 shrink-0 text-muted-foreground">•</span>
                    <span>{children}</span>
                  </li>
                );
              },
              strong({ children }) {
                return <strong className="font-semibold text-foreground">{children}</strong>;
              },
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      )}
    </section>
  );
}
