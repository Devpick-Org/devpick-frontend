"use client";

import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { TopNavVariant } from "@/components/layout/TopNavVariant";
import { AuthInitializer } from "@/components/features/auth/AuthInitializer";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { MainThemeSync } from "@/components/theme/MainThemeSync";
import { useUiStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useUiStore((s) => s.theme);

  return (
    <div id="main-layout" className={cn("bg-background min-h-screen", theme === "dark" && "dark")}>
    <Providers>
      <MainThemeSync />
      <AuthInitializer />
      {/* 버전 A 사이드바 + 상단바 */}
      {/* <TopNav />
      <Sidebar sidebarOpen={sidebarOpen} />
      {sidebarOpen ? (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed top-20 left-[208px] z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground md:flex"
          aria-label="사이드바 접기"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed top-20 left-3 z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground md:flex"
          aria-label="사이드바 펼치기"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )} 

      // pt-16: TopNav 고정 높이 보정 | md:pl-[220px]: 데스크탑 사이드바 보정 | pb-16 md:pb-0: 모바일 하단 탭 보정
      <main
        className={cn(
          "pt-16 pb-16 transition-[padding] duration-300 md:pb-0",
          sidebarOpen ? "md:pl-[220px]" : "md:pl-0",
        )}
      >
        {children}
      </main> */}

      <TopNavVariant />
      <main className="pt-16 pb-16 md:pb-0">
        {children}
      </main>

      <ScrollToTopButton />

      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          className: "border-0",
        }}
      />
    </Providers>
    </div>
  );
}
