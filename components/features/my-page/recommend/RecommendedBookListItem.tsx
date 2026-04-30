import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { MyPageRecommendBook } from "@/types/myPage";

export function RecommendedBookListItem({
  book,
}: {
  book: MyPageRecommendBook;
}) {
  const { title, authors, contents, thumbnail, url, price, salePrice, publisher } = book;
  const hasDiscount = salePrice !== -1;
  const hasThumbnail = thumbnail && thumbnail.trim() !== "";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-2 flex gap-4 px-2 py-3 transition-colors"
    >
      <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-sm bg-muted">
        {hasThumbnail ? (
          <Image fill src={thumbnail!} alt={title} className="object-cover" />
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
        {contents && (
          <p className="line-clamp-1 text-xs font-medium text-muted-foreground">
            {contents}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{authors.join(", ")}</p>
        <span className="text-xs text-muted-foreground">{publisher}</span>
        <div className="mt-auto pt-1">
          {hasDiscount ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-muted-foreground line-through">
                {price.toLocaleString()}원
              </span>
              <span className="text-sm font-semibold text-foreground">
                {salePrice.toLocaleString()}원
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              {price.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
