import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResultItem } from "@/types/search";
import { HomeSearchResultAccordionItem } from "./HomeSearchResultAccordionItem";

interface HomeSearchResultsSectionProps {
  results: SearchResultItem[];
  activeItemId: string | null;
  onToggle: (id: string) => void;
  onClose: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

function SearchResultSkeleton() {
  return (
    <div className="border-b border-border py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-14 shrink-0 rounded" />
        <Skeleton className="h-4 flex-1 rounded" />
        <Skeleton className="h-4 w-16 shrink-0 rounded" />
        <Skeleton className="h-4 w-4 shrink-0 rounded" />
      </div>
    </div>
  );
}

export function HomeSearchResultsSection({
  results,
  activeItemId,
  onToggle,
  onClose,
  isLoading = false,
  isError = false,
}: HomeSearchResultsSectionProps) {
  if (isLoading) {
    return (
      <section>
        <Skeleton className="mb-3 h-5 w-24 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <h2 className="mb-3 text-md font-semibold text-foreground">
          검색 결과
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-md font-semibold text-foreground">
        검색 결과 ({results.length})
      </h2>
      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
      ) : (
        <div>
          {results.map((item) => (
            <HomeSearchResultAccordionItem
              key={item.id}
              item={item}
              isOpen={activeItemId === item.id}
              onToggle={() => onToggle(item.id)}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </section>
  );
}
