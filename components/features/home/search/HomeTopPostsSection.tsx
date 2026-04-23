import { Skeleton } from "@/components/ui/skeleton";
import type { TrendTopPost } from "@/lib/mock/home-search-trend";

interface HomeTopPostsSectionProps {
  posts: TrendTopPost[];
  isLoading: boolean;
  rangeLabel: string;
}

export function HomeTopPostsSection({
  posts,
  isLoading,
  rangeLabel,
}: HomeTopPostsSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        {rangeLabel} 조회수 Top 5
      </h2>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
            >
              <span className="mt-0.5 w-5 shrink-0 text-center text-base font-bold leading-none text-primary">
                {post.rank}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                  {post.title}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    {post.sourceName}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {post.viewCount.toLocaleString()} views
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
