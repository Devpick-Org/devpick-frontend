import { API_ORIGIN } from "@/lib/api/client";

/**
 * 부트캠퍼 Next 이미지 URL은 레퍼러/WAF 때문에 브라우저 직링크가 실패할 수 있어,
 * 백엔드 프록시 URL로 바꿉니다.
 */
export function bootcampProxiedThumbnailUrl(
  thumbnailUrl: string | undefined | null,
): string | undefined {
  const u = thumbnailUrl?.trim();
  if (!u) return undefined;
  if (!u.includes("bootcamper.co.kr/_next/image")) return u;
  try {
    const parsed = new URL(u);
    const rel = parsed.searchParams.get("url");
    if (!rel?.trim()) return u;
    return `${API_ORIGIN}/trends/ecosystem/bootcamp-thumbnail?path=${encodeURIComponent(rel)}`;
  } catch {
    return u;
  }
}
