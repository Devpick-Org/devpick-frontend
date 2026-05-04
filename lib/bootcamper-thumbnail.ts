/** 부트캠퍼 카드 썸네일용. API 가 내려주는 `/_next/image?url=/uploads/...` 는 동일출처 프록시로 바꿉니다. */

export function bootcampTrendThumbnailSrc(
  apiThumbnailUrl: string | null | undefined,
): string | undefined {
  const trimmed = apiThumbnailUrl?.trim();
  if (!trimmed) return undefined;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.toLowerCase();
    const okHost = host === "bootcamper.co.kr" || host === "www.bootcamper.co.kr";
    if (!okHost || !u.pathname.startsWith("/_next/image")) {
      return trimmed;
    }

    const uploadPath = u.searchParams.get("url");
    if (!uploadPath || !uploadPath.startsWith("/uploads/")) {
      return trimmed;
    }

    return `/api/bootcamper-thumb?path=${encodeURIComponent(uploadPath)}`;
  } catch {
    return trimmed;
  }
}
