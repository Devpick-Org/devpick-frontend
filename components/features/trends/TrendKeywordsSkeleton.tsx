import { Skeleton } from "@/components/ui/skeleton";

export function TrendKeywordsSkeleton() {
  return (
    <div className="space-y-8">
      {/* 버블 카드 */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        {/* 카드 헤더: "인기 키워드" + "{date} 기준" */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3.5 w-28" />
        </div>

        {/* 버블 4구역 */}
        <div className="flex flex-col items-center gap-4 py-2">
          {/* 1위: 왕관 + 단독 버블 */}
          <div className="flex flex-col items-center gap-0.5">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-14 w-36 rounded-full" />
          </div>

          {/* 2~3위: 버블 2개 */}
          <div className="flex justify-center gap-3">
            {[120, 110].map((w, i) => (
              <Skeleton key={i} className="h-11 rounded-full" style={{ width: w }} />
            ))}
          </div>

          {/* 4~8위: medium 버블 5개 */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {[90, 100, 80, 96, 84].map((w, i) => (
              <Skeleton key={i} className="h-9 rounded-full" style={{ width: w }} />
            ))}
          </div>

          {/* 9위~: small 버블 12개 */}
          <div className="flex flex-wrap justify-center gap-2">
            {[64, 72, 56, 68, 60, 74, 56, 64, 60, 70, 54, 66].map((w, i) => (
              <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* 랭킹 리스트 */}
      <div className="space-y-3">
        {/* "순위별 보기" */}
        <Skeleton className="h-4 w-20" />

        {/* 2컬럼 그리드: [rank] [icon] [keyword] */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <Skeleton className="h-4 w-6 shrink-0" />
              <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
