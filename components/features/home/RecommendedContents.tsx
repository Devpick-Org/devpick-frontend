import Link from "next/link";
import { ContentThumbnail } from "@/components/ui/content-thumbnail";
import type { Content } from "@/types/content";

interface RecommendedContentsProps {
  items: Content[];
}

export function RecommendedContents({ items }: RecommendedContentsProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-md font-semibold text-foreground">
        이런 글은 어떠신가요?
      </h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/home/${item.id}`} className="block">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <ContentThumbnail
                  thumbnailUrl={item.thumbnailUrl}
                  alt={item.translatedTitle ?? item.title}
                  containerClassName="h-36 w-full"
                  sizes="288px"
                />

                <div className="p-3">
                  <p className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {item.translatedTitle ?? item.title}
                  </p>
                  <span className="text-xs text-muted-foreground font-medium">
                    {item.sourceName}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
