"use client";

import { SourceLogo } from "@/components/features/home/SourceLogo";

const SOURCES = [
  "velog",
  "naver_d2",
  "kakao_tech",
  "toss_tech",
  "oliveyoung_tech",
  "stack overflow",
  "medium",
  "우아한형제들",
  "unknown_source",
];

export default function TestLogosPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-8 text-xl font-bold">SourceLogo 테스트</h1>

      {/* size=17 — FeedCard */}
      <section className="mb-10">
        <p className="mb-4 text-sm font-semibold text-muted-foreground">
          size=17 (FeedCard 배지)
        </p>
        <div className="flex flex-col gap-4">
          {SOURCES.map((name) => (
            <div key={name} className="flex items-center gap-3">
              <SourceLogo sourceName={name} size={17} />
              <span className="text-sm text-foreground">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* size=20 — 검색 아코디언 */}
      <section className="mb-10">
        <p className="mb-4 text-sm font-semibold text-muted-foreground">
          size=20 (검색 결과 아코디언)
        </p>
        <div className="flex flex-col gap-4">
          {SOURCES.map((name) => (
            <div key={name} className="flex items-center gap-3">
              <SourceLogo sourceName={name} size={20} />
              <span className="text-sm text-foreground">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
