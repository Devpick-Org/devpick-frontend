import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { MyPageRecommendBook } from "@/types/myPage";

export function RecommendedBookCard({ book }: { book: MyPageRecommendBook }) {
  const { title, authors, thumbnail, url, publisher, price, salePrice } = book;
  const hasDiscount = salePrice !== -1;
  const hasThumbnail = thumbnail && thumbnail.trim() !== "";

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {hasThumbnail ? (
            <Image
              fill
              src={thumbnail!}
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
          <span className="text-xs text-muted-foreground">{publisher}</span>
          {hasDiscount ? (
            <div className="flex flex-col">
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
