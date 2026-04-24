import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import { SourceLogo } from "@/components/features/home/SourceLogo";
import { formatDate } from "@/lib/utils";
import type { MyPageRecommendHomePost } from "@/types/myPage";

export function RecommendedHomePostCard({
  post,
}: {
  post: MyPageRecommendHomePost;
}) {
  const { contentId, title, sourceName, thumbnail, date } = post;

  return (
    <Link href={`/home/${contentId}`}>
      <div className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {thumbnail ? (
            <Image
              fill
              src={thumbnail}
              alt={title}
              className="object-cover transition-transform duration-200"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <div className="flex items-center gap-1.5">
            <SourceLogo sourceName={sourceName} size={13} />
            <span className="text-xs text-muted-foreground">{sourceName}</span>
          </div>
          <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug tracking-[-0.01em] text-foreground">
            {title}
          </p>
          <span className="text-xs text-muted-foreground">
            {formatDate(date)}
          </span>
        </div>
      </div>
    </Link>
  );
}
