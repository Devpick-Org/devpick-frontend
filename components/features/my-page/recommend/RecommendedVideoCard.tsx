import Image from "next/image";
import { Youtube } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MyPageRecommendVideo } from "@/types/myPage";

function formatViews(views: number): string {
  if (views >= 10000) return `${Math.floor(views / 10000)}만`;
  if (views >= 1000) return `${Math.floor(views / 1000)}천`;
  return String(views);
}

export function RecommendedVideoCard({ video }: { video: MyPageRecommendVideo }) {
  const { title, channelName, thumbnail, url, duration, views, uploadedAt } = video;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
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
              <Youtube className="h-6 w-6 text-muted-foreground/30" />
            </div>
          )}
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug tracking-[-0.01em] text-foreground">
            {title}
          </p>
          <span className="text-xs text-muted-foreground">
            {channelName}
            <span className="mx-1">·</span>
            조회 {formatViews(views)}
            <span className="mx-1">·</span>
            {formatDate(uploadedAt)}
          </span>
        </div>
      </div>
    </a>
  );
}
