import { Providers } from "@/components/providers";

// 공유 링크 페이지 전용 레이아웃
// — (main)/ 레이아웃 밖이므로 QueryClientProvider를 직접 제공
export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
