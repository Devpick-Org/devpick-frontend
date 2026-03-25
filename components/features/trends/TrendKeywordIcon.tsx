"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * 키워드 → 아이콘 파일 slug 변환
 * - next.js  → nextjs
 * - node.js  → nodejs
 * - c#       → c%23  (URL에서 # 은 fragment로 해석되므로 인코딩 필요)
 * - 나머지는 키워드 소문자 그대로 사용
 */
const KEYWORD_SLUG_MAP: Record<string, string> = {
  "next.js": "nextjs",
  "node.js": "nodejs",
  "c#": "c%23",
};

function getIconPath(keyword: string): string {
  const lower = keyword.toLowerCase();
  const slug = KEYWORD_SLUG_MAP[lower] ?? lower;
  return `/icons/tech/${slug}.svg`;
}

interface TrendKeywordIconProps {
  keyword: string;
  size?: number;
}

export function TrendKeywordIcon({ keyword, size = 24 }: TrendKeywordIconProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <KeywordInitial keyword={keyword} size={size} />;
  }

  return (
    <Image
      src={getIconPath(keyword)}
      alt={keyword}
      width={size}
      height={size}
      className="shrink-0"
      onError={() => setHasError(true)}
    />
  );
}

function KeywordInitial({ keyword, size }: { keyword: string; size: number }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase"
      style={{ width: size, height: size }}
    >
      {keyword.charAt(0)}
    </span>
  );
}
