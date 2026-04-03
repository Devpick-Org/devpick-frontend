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
  const mounted = useHydrated();

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/community");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return <CommunityDetailPage postId={postId} />;
}
