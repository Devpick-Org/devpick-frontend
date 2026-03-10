import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
// import { AuthInitializer } from "@/components/features/auth/AuthInitializer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {/* <AuthInitializer /> */}
      <TopNav />
      <Sidebar />
      {/* pt-16: TopNav 고정 높이 보정 | md:pl-[220px]: 데스크탑 사이드바 보정 | pb-16 md:pb-0: 모바일 하단 탭 보정 */}
      <main className="pt-16 md:pl-[220px] pb-16 md:pb-0">{children}</main>
      <Toaster richColors position="bottom-right" />
    </Providers>
  );
}
