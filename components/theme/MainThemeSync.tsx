"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/ui.store";

// FOUC 방지 스크립트가 <html>에 임시로 붙인 .dark를 제거하고 Zustand 상태 초기화
// .dark 클래스는 (main)/layout.tsx가 Zustand state를 읽어 #main-layout에 직접 적용
export function MainThemeSync() {
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const saved = localStorage.getItem("theme");
    const resolved: "light" | "dark" = saved === "dark" ? "dark" : isDark ? "dark" : "light";

    document.documentElement.classList.remove("dark");

    useUiStore.setState({ theme: resolved });
  }, []);

  return null;
}
