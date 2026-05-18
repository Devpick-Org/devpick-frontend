"use client";

import { useEffect } from "react";

// 랜딩/로그인 등 non-main 페이지에서 <html>의 .dark 클래스를 제거
export function RemoveDarkFromHtml() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return null;
}
