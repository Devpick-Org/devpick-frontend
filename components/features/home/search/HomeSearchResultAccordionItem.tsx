import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SearchResultItem } from "@/types/search";

interface HomeSearchResultAccordionItemProps {
  item: SearchResultItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function HomeSearchResultAccordionItem({
  item,
  isOpen,
  onToggle,
}: HomeSearchResultAccordionItemProps) {
  return (
    <div className="border-b border-border">
      {/* 닫힘 상태 — 한 줄 */}
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 py-3 text-left"
      >
        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {item.sourceName}
        </span>
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {item.title}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {item.publishedAt}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {/* 열림 상태 — 인라인 확장 */}
      {isOpen && (
        <div className="flex gap-4 pb-4 pl-1">
          {item.thumbnailUrl && (
            <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={item.url}
              className="mt-1 w-fit text-xs font-medium text-primary hover:underline"
            >
              전체 글 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
