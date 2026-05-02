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

export function RecommendedVideoListItem({
  video,
}: {
  video: MyPageRecommendVideo;
}) {
  const { title, translatedTitle, videoId, channelName, thumbnailUrl, duration, publishedAt, tags } =
    video;
  const displayTitle = translatedTitle ?? title;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const content = (
    <>
      <div className="relative aspect-[3/2] w-36 shrink-0 overflow-hidden rounded-sm bg-muted">
        {thumbnailUrl ? (
          <Image fill src={thumbnailUrl} alt={displayTitle} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Youtube className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
        {duration && (
          <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-white">
            {parseDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {displayTitle}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-1.5 py-px text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className="mt-auto pt-1 text-xs text-muted-foreground">
          {channelName && (
            <>
              {channelName}
              <span className="mx-1">·</span>
            </>
          )}
          {formatDate(publishedAt)}
        </span>
      </div>
    </>
  );

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-2 flex gap-4 px-2 py-3 transition-colors"
    >
      {content}
    </a>
  );
}
