import { Providers } from "@/components/providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {/* TODO: GNB 컴포넌트 (DP-192) */}
      <main>{children}</main>
      {/* TODO: Footer 컴포넌트 (DP-192) */}
    </Providers>
  );
}
