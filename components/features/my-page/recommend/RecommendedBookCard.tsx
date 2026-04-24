import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { MyPageRecommendBook } from "@/types/myPage";

export function RecommendedBookCard({ book }: { book: MyPageRecommendBook }) {
  const { title, authors, cover, url, publisher, publishedAt } = book;
  const year = publishedAt ? publishedAt.slice(0, 4) : "";

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {cover ? (
            <Image
              fill
              src={cover}
              alt={title}
              className="object-cover transition-transform duration-200"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-6 w-6 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug tracking-[-0.01em] text-foreground">
            {title}
          </p>
          <span className="text-xs text-muted-foreground">
            {authors.join(", ")}
          </span>
          <span className="text-xs text-muted-foreground">
            {publisher}
            <span className="mx-1">·</span>
            {year}
          </span>
        </div>
      </div>
    </a>
  );
}
