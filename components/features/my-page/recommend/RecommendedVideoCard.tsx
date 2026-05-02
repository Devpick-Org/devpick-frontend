import Image from "next/image";
import { Youtube } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MyPageRecommendVideo } from "@/types/myPage";

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RecommendedVideoCard({ video }: { video: MyPageRecommendVideo }) {
  const { title, translatedTitle, videoId, channelName, thumbnailUrl, duration, publishedAt } =
    video;
  const displayTitle = translatedTitle ?? title;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const content = (
    <div className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <Image
            fill
            src={thumbnailUrl}
            alt={displayTitle}
            className="object-cover transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Youtube className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1 py-0.5 text-[11px] font-medium text-white">
            {parseDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug tracking-[-0.01em] text-foreground">
          {displayTitle}
        </p>
        <span className="text-xs text-muted-foreground">
          {channelName && (
            <>
              {channelName}
              <span className="mx-1">·</span>
            </>
          )}
          {formatDate(publishedAt)}
        </span>
      </div>
    </div>
  );

  return (
    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
