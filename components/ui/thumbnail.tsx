import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThumbnailProps {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  ratio?: "square" | "landscape" | "video";
  sizes?: string;
  className?: string;
}

const RATIO_CLASS: Record<NonNullable<ThumbnailProps["ratio"]>, string> = {
  square: "aspect-square",
  landscape: "aspect-[5/4]",
  video: "aspect-video",
};

export function Thumbnail({
  src,
  alt,
  fit = "cover",
  ratio = "landscape",
  sizes = "(max-width: 768px) 100vw, 740px",
  className,
}: ThumbnailProps) {
  const ratioClass = RATIO_CLASS[ratio];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        ratioClass,
        className,
      )}
    >
      {fit === "contain" && (
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-neutral-100/60" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={fit === "cover" ? "object-cover" : "object-contain"}
        sizes={sizes}
      />
    </div>
  );
}
