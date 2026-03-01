import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevPick",
  description: "당신을 위한 최적의 개발 콘텐츠 피드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
