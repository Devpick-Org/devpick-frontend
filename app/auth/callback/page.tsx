"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // error는 값이 확정되는 즉시 처리 (초기 렌더에서도 존재 여부가 명확)
  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    console.log({ code, error });

    if (error) {
      console.error("소셜 로그인 에러:", error);
      router.replace("/");
      return;
    }

    if (!code) {
      console.error("인가 코드가 없습니다.");
      router.replace("/");
      return;
    }

    // TODO: 백엔드 API 호출 후, 응답 결과(신규 회원 여부 등)에 따라 라우팅 분기 처리 및 에러 핸들링
    const timer = setTimeout(() => {
      if (Math.random() > 0.5) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

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

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={<CallbackFallback />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
