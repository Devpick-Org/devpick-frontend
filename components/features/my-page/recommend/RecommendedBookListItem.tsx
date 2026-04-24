import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { MyPageRecommendBook } from "@/types/myPage";

export function RecommendedBookListItem({
  book,
}: {
  book: MyPageRecommendBook;
}) {
  const {
    title,
    authors,
    description,
    cover,
    url,
    price,
    publisher,
    publishedAt,
  } = book;
  const year = publishedAt ? publishedAt.slice(0, 4) : "";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-2 flex gap-4 px-2 py-3 transition-colors"
    >
      <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-sm bg-muted">
        {cover ? (
          <Image fill src={cover} alt={title} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {title}
        </p>

        {description && (
          <p className="line-clamp-1 text-xs text-muted-foreground font-medium">
            {description}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{authors.join(", ")}</p>
        <span className="mt-auto pt-1 text-xs text-muted-foreground">
          {publisher}
          <span className="mx-1">·</span>
          {year}
        </span>
        {price && (
          <span className="text-sm font-medium text-foreground">
            {price.toLocaleString()}원
          </span>
        )}
      </div>
    </a>
  );
}
