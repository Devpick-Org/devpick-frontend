import { AuthInitializer } from "@/components/features/auth/AuthInitializer";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
