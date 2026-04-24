import { Skeleton } from "@/components/ui/skeleton";

export function WrongQuizListItemSkeleton() {
  return (
    <div className="flex gap-4 px-2 py-3">
      <Skeleton className="aspect-[3/2] w-36 shrink-0 rounded-sm" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
        <Skeleton className="mt-auto h-3 w-2/5 rounded" />
      </div>
    </div>
  );
}
