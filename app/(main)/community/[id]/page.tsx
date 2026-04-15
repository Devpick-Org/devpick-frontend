"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useAuthStore } from "@/store/auth.store";
import { CommunityDetailPage } from "@/components/features/community/CommunityDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const { id: postId } = use(params);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const mounted = useHydrated();

  useEffect(() => {
    if (mounted && isInitialized && !isAuthenticated) {
      router.replace("/community");
    }
  }, [mounted, isInitialized, isAuthenticated, router]);

  if (!mounted || !isInitialized || !isAuthenticated) return null;

  return <CommunityDetailPage postId={postId} />;
}
