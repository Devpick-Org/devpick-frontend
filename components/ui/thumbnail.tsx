import Image from "next/image";
import { cn } from "@/lib/utils";

export type ThumbnailMode = "fixed-cover" | "fixed-contain" | "natural";

// ── 분기 상수 ────────────────────────────────────────────────────────────────
const BASE_RATIO = 4 / 3; // ~1.333
const SIMILARITY_THRESHOLD = 0.15; // BASE_RATIO + 0.15 ≈ 1.483 이하 → fixed-cover
const MAX_NATURAL_RATIO = 2.4; // 2.4:1 이상 파노라마 → fixed-cover 폴백

/**
 * 서버 메타데이터 기반으로 썸네일 렌더링 모드를 결정한다.
 * - undefined / null → fixed-cover (폴백)
 * - 세로형 (ratio < 1) → fixed-contain
 * - 가로형, 4:3과 유사 (ratio ≤ ~1.483) → fixed-cover
 * - 가로형, 충분히 넓음 (1.483 < ratio < 2.4) → natural
 * - 파노라마 (ratio ≥ 2.4) → fixed-cover 폴백
 */
export function getThumbnailMode(
  w: number | null | undefined,
  h: number | null | undefined,
): ThumbnailMode {
  if (w == null || h == null) return "fixed-cover";
  const ratio = w / h;
  if (ratio < 1) return "fixed-contain";
  if (ratio >= MAX_NATURAL_RATIO) return "fixed-cover";
  if (ratio <= BASE_RATIO + SIMILARITY_THRESHOLD) return "fixed-cover";
  return "natural";
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  src: string;
  alt: string;
  mode: ThumbnailMode;
  /** mode === "natural" 일 때 aspect-ratio 계산에 사용 (w / h) */
  aspectRatio?: number;
  sizes?: string;
  className?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export function Thumbnail({
  src,
  alt,
  mode,
  aspectRatio,
  sizes = "(max-width: 768px) 100vw, 740px",
  className,
}: ThumbnailProps) {
  // ── natural: 카드 width 기준, 원본 비율대로 height 결정 ─────────────────
  if (mode === "natural") {
    return (
      <div
        className={cn("relative w-full overflow-hidden", className)}
        style={{ aspectRatio: aspectRatio ?? BASE_RATIO }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>
    );
  }

  // ── fixed-cover / fixed-contain: 4:3 고정 컨테이너 ──────────────────────
  return (
    <div
      className={cn("relative aspect-[4/3] w-full overflow-hidden", className)}
    >
      {/* blurred background — fixed-contain 전용 */}
      {mode === "fixed-contain" && (
        <Image
          src={src}
          alt=""
          fill
          aria-hidden
          className="object-cover scale-110 blur-xl brightness-50"
          sizes={sizes}
        />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={
          mode === "fixed-contain" ? "object-contain" : "object-cover"
        }
        sizes={sizes}
      />
    </div>
  );
}
