"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/ui.store";

// 마운트 시 localStorage 값으로 Zustand theme 상태만 동기화
// DOM(.dark 클래스)은 layout.tsx 인라인 스크립트가 이미 처리하므로 여기서 건드리지 않음
export function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const resolved: "light" | "dark" = saved === "dark" ? "dark" : "light";
    useUiStore.setState({ theme: resolved });
  }, []);

  return null;
}
