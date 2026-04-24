"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { SourceLogo } from "@/components/features/home/SourceLogo";
import { formatDate } from "@/lib/utils";
import type { MyPageScrap } from "@/types/myPage";

export function ScrappedPostCard({ scrap }: { scrap: MyPageScrap }) {
  const { contentId, title, sourceName, thumbnail, createdAt } = scrap;

  return (
    <Link
      href={`/home/${contentId}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card"
    >
      {thumbnail ? (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            fill
            src={thumbnail}
            alt={title}
            className="object-cover transition-transform duration-200"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-muted/50">
          <Bookmark className="h-6 w-6 text-muted-foreground/30" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center gap-1.5">
          <SourceLogo sourceName={sourceName} size={14} />
          <span className="text-xs text-muted-foreground font-medium">
            {sourceName}
          </span>
        </div>

        <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug tracking-[-0.01em] text-foreground">
          {title}
        </p>

        <span className="text-xs text-muted-foreground">
          {formatDate(createdAt)}
        </span>
      </div>
    </Link>
  );
}
