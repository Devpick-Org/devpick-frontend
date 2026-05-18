import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { RemoveDarkFromHtml } from "@/components/theme/RemoveDarkFromHtml";
import "./globals.css";

// 폰트 설정
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Trace",
  description: "당신을 위한 최적의 개발 콘텐츠 피드",
};

// 뷰포트 설정
export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: 다크모드 적용 시 서버/클라이언트 테마 차이로 인한 경고 방지
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 새로고침 시 다크모드 깜빡임(FOUC) 방지 — Providers 마운트 전에 실행 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      {/* body: 브라우저 확장(예: Video Speed Controller)이 class를 주입해 hydration 불일치가 날 수 있음 */}
      <body
        className={`${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* 랜딩/로그인 등 non-main 페이지에서 <html>의 .dark 제거 */}
        <RemoveDarkFromHtml />
        {/* 모든 능력(데이터+테마)이 담긴 Providers로 감싸기 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
