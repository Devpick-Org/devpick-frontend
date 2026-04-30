import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
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
                {/* 썸네일 */}
                <div className="relative h-36 w-full bg-secondary">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.translatedTitle ?? item.title}
                      fill
                      className="object-cover"
                      sizes="288px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* 텍스트 */}
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
