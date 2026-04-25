/**
 * 랠릿·노션류 JD에서 넘어오는 줄 앞머리 기호(·, •, *, - 등)를 제거해
 * 화면의 커스텀 bullet과 겹치지 않게 합니다.
 */
export function sanitizeJobDetailLine(raw: string): string {
  let s = raw.replace(/\uFEFF/g, "").trim();
  if (!s) return s;

  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s
      .replace(/^\*+\s*/, "")
      .replace(/\s\*+\s*$/, "")
      .replace(/^\*\s+\*\s+/, "")
      .replace(/^[\s]*[·•\u00B7\u2022\u2023\u25E6\u2219]\s*/, "")
      .replace(/^[\s]*[-–—]\s+/, "")
      .trim();
  }
  return s;
}

export function sanitizeJobDetailLines(lines: string[] | undefined): string[] {
  if (!lines?.length) return [];
  return lines.map(sanitizeJobDetailLine).filter((s) => s.length > 0);
}
