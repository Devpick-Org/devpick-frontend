import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import { SourceLogo } from "@/components/features/home/SourceLogo";
import { formatDate } from "@/lib/utils";
import type { MyPageRecommendHomePost } from "@/types/myPage";

export function RecommendedHomePostListItem({
  post,
}: {
  post: MyPageRecommendHomePost;
}) {
  const { contentId, title, sourceName, thumbnail, summary, date } = post;

  return (
    <Link
      href={`/home/${contentId}`}
      className="-mx-2 flex gap-4 px-2 py-3 transition-colors"
    >
      <div className="relative aspect-[3/2] w-36 shrink-0 overflow-hidden rounded-sm bg-muted">
        {thumbnail ? (
          <Image fill src={thumbnail} alt={title} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <SourceLogo sourceName={sourceName} size={13} />
          <span className="text-xs font-medium text-muted-foreground">
            {sourceName}
          </span>
        </div>
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {title}
        </p>
        {summary && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{summary}</p>
        )}
        <span className="mt-auto pt-1 text-xs text-muted-foreground">
          {formatDate(date)}
        </span>
      </div>
    </Link>
  );
}
