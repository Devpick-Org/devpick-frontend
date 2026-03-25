import { Skeleton } from "@/components/ui/skeleton";

export function TrendKeywordsSkeleton() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* 버블 영역 */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap gap-2.5">
          {[120, 90, 100, 80, 110, 70, 85, 65, 75, 60].map((w, i) => (
            <Skeleton key={i} className="h-9 rounded-full" style={{ width: w }} />
          ))}
          {[55, 60, 50, 58, 52, 56, 50, 54, 48, 52].map((w, i) => (
            <Skeleton key={i + 10} className="h-7 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
