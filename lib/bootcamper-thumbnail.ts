/** 부트캠퍼 카드용. 업로드 직링크(/uploads 경로 단독 요청은 404)는 동일출처 프록시로 우회합니다. */

const BOOTCAMP_ORIGIN = "https://bootcamper.co.kr";

function bootcamperHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === "bootcamper.co.kr" || h === "www.bootcamper.co.kr";
}

function proxied(uploadPathDecoded: string): string {
  return `/api/bootcamper-thumb?path=${encodeURIComponent(uploadPathDecoded)}`;
}

/** `/uploads/...` 절대 경로 문자열 또는 `_next/image?url=` 안의 경로 에서 디코된 업로드 경로만 허용. */
function uploadsPathFromBootcamperUrl(trimmed: string): string | null {
  try {
    const u = new URL(trimmed);
    if (!bootcamperHost(u.hostname)) {
      return null;
    }

    const path = u.pathname;

    // 직링크 https://bootcamper.co.kr/uploads/foo.png → 404
    if (
      path.startsWith("/uploads/") &&
      path.length > "/uploads/".length &&
      !path.includes("..")
    ) {
      return path;
    }

    if (path.startsWith("/_next/image")) {
      const inner = u.searchParams.get("url");
      if (
        inner &&
        inner.startsWith("/uploads/") &&
        inner.length > "/uploads/".length &&
        !inner.includes("..")
      ) {
        return inner;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 카드 `<img>` src: 가능하면 같은 출처 프록시.
 * API 가 `_next/image?...` 이든 업로드 절대 URL 이던 업로드 경로만 안전하게 뽑아 프록시합니다.
 */
export function bootcampTrendThumbnailSrc(
  apiThumbnailUrl: string | null | undefined,
): string | undefined {
  const trimmed = apiThumbnailUrl?.trim();
  if (!trimmed) {
    return undefined;
  }

  const uploadPath = uploadsPathFromBootcamperUrl(trimmed);
  if (uploadPath) {
    return proxied(uploadPath);
  }

  try {
    const u = new URL(trimmed);
    if (!bootcamperHost(u.hostname)) {
      return trimmed;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

/**
 * 프록시 실패 시 두 번째 시도: 브라우저가 부트캠퍼 Next 이미지 로더를 직접 호출합니다.
 */
export function bootcampTrendUpstreamNextImageSrc(
  apiThumbnailUrl: string | null | undefined,
): string | undefined {
  const trimmed = apiThumbnailUrl?.trim();
  if (!trimmed) {
    return undefined;
  }

  const uploadPath = uploadsPathFromBootcamperUrl(trimmed);
  if (!uploadPath) {
    try {
      const u = new URL(trimmed);
      if (bootcamperHost(u.hostname) && u.pathname.startsWith("/_next/image")) {
        return trimmed;
      }
    } catch {
      /* fall through */
    }
    return undefined;
  }

  const enc = encodeURIComponent(uploadPath);
  return `${BOOTCAMP_ORIGIN}/_next/image?url=${enc}&w=640&q=75`;
}
