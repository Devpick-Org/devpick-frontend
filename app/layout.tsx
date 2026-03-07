import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// 폰트 설정
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "DevPick",
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {/* 모든 능력(데이터+테마)이 담긴 Providers로 감싸기 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
