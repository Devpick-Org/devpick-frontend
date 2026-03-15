"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/store/auth.store";

interface CallbackHandlerProps {
  provider: "github" | "google";
}

function CallbackHandler({ provider }: CallbackHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code || !state) {
      router.replace("/");
      return;
    }

    const callbackFn =
      provider === "github"
        ? authEndpoints.githubCallback
        : authEndpoints.googleCallback;

    callbackFn(code, state)
      .then(async ({ data }) => {
        const { accessToken, userId, email, nickname, isNewUser } = data.data;
        // accessToken을 먼저 등록해야 이후 /users/me 요청에 Authorization 헤더가 붙음
        setAuth({ userId, email, nickname }, accessToken);

        if (!isNewUser) {
          // 기존 유저: 소셜 로그인 응답에 job/level/tags가 없으므로 /users/me로 전체 프로필 조회
          const { data: meData } = await authEndpoints.getMe();
          setAuth(meData.data, accessToken);
        }

        router.replace(isNewUser ? "/onboarding" : "/home");
      })
      .catch(() => {
        router.replace("/");
      });
  }, [searchParams, router, setAuth, provider]);

  return null;
}

function CallbackFallback() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-muted-foreground text-sm">
        로그인 정보를 확인하고 있습니다...
      </p>
    </div>
  );
}

interface AuthCallbackPageProps {
  provider: "github" | "google";
}

export function AuthCallbackPage({ provider }: AuthCallbackPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={<CallbackFallback />}>
        <CallbackHandler provider={provider} />
      </Suspense>
    </div>
  );
}
