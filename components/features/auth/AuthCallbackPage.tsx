"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/store/auth.store";
import { extractApiError, getAuthErrorMessage } from "@/lib/auth/getAuthErrorMessage";

interface CallbackHandlerProps {
  provider: "github" | "google";
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

function CallbackHandler({ provider }: CallbackHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverError, setRecoverError] = useState("");

  // AlertDialogAction 클릭 시 onOpenChange가 동시에 호출되어 /로 이동하는 것을 방지
  const isRecoveringRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error === "access_denied") {
      router.replace(`/auth?oauthError=${encodeURIComponent(getAuthErrorMessage("AUTH_019"))}`);
      return;
    }

    if (!code || !state) {
      router.replace(`/auth?oauthError=${encodeURIComponent("소셜 로그인 중 오류가 발생했습니다.")}`);
      return;
    }

    const callbackFn =
      provider === "github"
        ? authEndpoints.githubCallback
        : authEndpoints.googleCallback;

    callbackFn(code, state)
      .then(async ({ data }) => {
        const { accessToken, userId, email, nickname, isNewUser } = data.data;
        setAuth({ userId, email, nickname }, accessToken);

        if (!isNewUser) {
          const { data: meData } = await authEndpoints.getMe();
          setAuth(meData.data, accessToken);
        }

        router.replace(isNewUser ? "/onboarding" : "/home");
      })
      .catch((err: unknown) => {
        const { code: errCode, message, recoveryToken: token } = extractApiError(err);

        if (errCode === "AUTH_024" && token) {
          setRecoveryToken(token);
          setShowRecoverModal(true);
        } else {
          const errorMsg = getAuthErrorMessage(errCode, message ?? "소셜 로그인 중 오류가 발생했습니다.");
          router.replace(`/auth?oauthError=${encodeURIComponent(errorMsg)}`);
        }
      });
  }, [searchParams, router, setAuth, provider]);

  const handleRecover = useCallback(async () => {
    if (!recoveryToken) return;

    isRecoveringRef.current = true;
    setIsRecovering(true);
    setRecoverError("");

    try {
      const response = await authEndpoints.socialRecover({ recoveryToken });
      const { accessToken, userId, email, nickname } = response.data.data;
      setAuth({ userId, email, nickname }, accessToken);

      const { data: meData } = await authEndpoints.getMe();
      setAuth(meData.data, accessToken);

      router.replace("/home");
    } catch (err) {
      const { code: errCode, message } = extractApiError(err);
      setRecoverError(
        getAuthErrorMessage(errCode, message ?? "계정 복구 중 오류가 발생했습니다."),
      );
      setShowRecoverModal(true);
    } finally {
      isRecoveringRef.current = false;
      setIsRecovering(false);
    }
  }, [recoveryToken, setAuth, router]);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isRecoveringRef.current) {
        router.replace("/auth");
      }
      setShowRecoverModal(open);
    },
    [router],
  );

  if (isRecovering) {
    return <CallbackFallback />;
  }

  return (
    <ConfirmModal
      open={showRecoverModal}
      onClose={() => handleDialogOpenChange(false)}
      title="계정을 복구할까요?"
      description={
        <>
          최근 탈퇴한 계정입니다.
          <br />
          복구하시면 바로 로그인됩니다.
          {recoverError && (
            <span className="mt-2 block text-center text-red-500">
              {recoverError}
            </span>
          )}
        </>
      }
      cancelText="아니요"
      confirmText="복구하기"
      onConfirm={handleRecover}
    />
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
