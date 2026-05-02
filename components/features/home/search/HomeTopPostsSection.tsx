import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrendTopPost } from "@/types/search";

function ThumbnailPlaceholder({ sourceName }: { sourceName: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <span className="text-xs text-muted-foreground">{sourceName}</span>
    </div>
  );
}

function ChangeRate({ rate }: { rate: number }) {
  if (rate === 0) {
    return <span className="text-[11px] text-muted-foreground">-</span>;
  }
  const isPositive = rate > 0;
  return (
    <span
      className={`text-[11px] font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}
    >
      {isPositive ? "▲" : "▼"} {Math.abs(rate).toFixed(1)}%
    </span>
  );
}

function TopPostCard({
  post,
  onClose,
}: {
  post: TrendTopPost;
  onClose: () => void;
}) {
  return (
    <Link
      href={`/home/${post.id}`}
      onClick={onClose}
      className="w-44 shrink-0 overflow-hidden rounded-md border border-border bg-card block"
    >
      {/* 썸네일 영역 */}
      <div className="relative aspect-video w-full overflow-hidden">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <ThumbnailPlaceholder sourceName={post.sourceName} />
        )}
        {/* 순위 배지 */}
        <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
          {post.rank}
        </span>
      </div>

      {/* 카드 내용 */}
      <div className="flex flex-col gap-1.5 p-3">
        <span className="text-[11px] font-medium text-muted-foreground">
          {post.category}
        </span>
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground">
          {post.translatedTitle || post.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {post.viewCount.toLocaleString()} views
          </span>
          <ChangeRate rate={post.changeRate} />
        </div>
      </div>
    </Link>
  );
}

function TopPostCardSkeleton() {
  return (
    <div className="w-44 shrink-0 overflow-hidden rounded-md border border-border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-14 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>
  );
}

interface HomeTopPostsSectionProps {
  posts: TrendTopPost[];
  isLoading: boolean;
  rangeLabel: string;
  summary?: string | null;
  onClose: () => void;
}

export function HomeTopPostsSection({
  posts,
  isLoading,
  rangeLabel,
  summary,
  onClose,
}: HomeTopPostsSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-md font-semibold text-foreground">
        {rangeLabel} 조회수 Top 5
      </h2>
      {/* 동향 요약 */}
      <div className="mb-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-11/12 rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>
        ) : (
          summary && (
            <p className="text-sm leading-relaxed text-foreground">{summary}</p>
          )
        )}
      </div>
      {/* 스크롤 컨테이너와 flex 행 분리 — 동일 요소에 flex+overflow-x-auto를 쓰면
          브라우저가 flex 내재 너비(max-content)로 컨테이너 크기를 계산해 스크롤이 발동하지 않음 */}
      <div className="w-full overflow-x-auto pb-1 [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent">
        {" "}
        <div className="flex w-max gap-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TopPostCardSkeleton key={i} />
              ))
            : posts.map((post) => <TopPostCard key={post.id} post={post} onClose={onClose} />)}
        </div>
      </div>
    </section>
  );
}
