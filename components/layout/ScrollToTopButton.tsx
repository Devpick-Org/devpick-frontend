"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_THRESHOLD = 300;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로"
      className={cn(
        // 위치 — 모바일: 탭바(64px) + 여유 16px, 데스크탑: 24px
        "fixed right-4 z-40",
        "bottom-[84px] md:bottom-6",
        // 크기 · 모양
        "flex h-12 w-12 items-center justify-center rounded-full",
        // 색상 · 테두리 · 그림자
        "border border-border bg-card text-muted-foreground shadow-md",
        // 호버
        "transition-all duration-200 hover:text-foreground hover:shadow-lg",
        // 노출 토글 — opacity + translate로 부드럽게
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
