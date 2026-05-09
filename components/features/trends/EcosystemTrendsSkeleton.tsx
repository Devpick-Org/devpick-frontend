import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-2.5 rounded-2xl border border-border/60 bg-card p-2.5">
      <Skeleton className="aspect-[16/10] w-full rounded-xl" />
      <div className="flex flex-col gap-1.5 px-0.5 pb-1">
        <div className="flex items-start justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
        <div className="flex items-start gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="mt-px h-4 w-10 shrink-0 rounded-md" />
        </div>
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-20" />
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-4 overflow-hidden rounded-xl border border-border/50 bg-muted/20 py-2 pl-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function EcosystemTrendsSkeleton() {
  return (
    <div className="space-y-6">
      {/* 검색바 */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* 필터 */}
      <div className="flex gap-1.5">
        {[40, 56, 44, 40].map((w, i) => (
          <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* 섹션 3개 */}
      <div className="flex flex-col gap-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
