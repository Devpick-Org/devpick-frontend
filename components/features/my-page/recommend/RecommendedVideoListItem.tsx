import Image from "next/image";
import { Youtube } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MyPageRecommendVideo } from "@/types/myPage";

function formatViews(views: number): string {
  if (views >= 10000) return `${Math.floor(views / 10000)}만`;
  if (views >= 1000) return `${Math.floor(views / 1000)}천`;
  return String(views);
}

export function RecommendedVideoListItem({
  video,
}: {
  video: MyPageRecommendVideo;
}) {
  const { title, channelName, thumbnail, url, duration, views, uploadedAt } =
    video;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-2 flex gap-4 px-2 py-3 transition-colors"
    >
      <div className="relative aspect-[3/2] w-36 shrink-0 overflow-hidden rounded-sm bg-muted">
        {thumbnail ? (
          <Image fill src={thumbnail} alt={title} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Youtube className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-white">
          {duration}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{channelName}</p>
        <span className="mt-auto pt-1 text-xs text-muted-foreground">
          조회 {formatViews(views)}
          <span className="mx-1">·</span>
          {formatDate(uploadedAt)}
        </span>
      </div>
    </a>
  );
}
