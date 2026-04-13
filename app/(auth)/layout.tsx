"use client";

import { AuthInitializer } from "@/components/features/auth/AuthInitializer";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      {children}
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          className: "border-0",
        }}
      />
    </>
  );
}
