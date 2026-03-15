"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { authEndpoints } from "@/lib/api/endpoints/auth";

function DevPickLogo() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
        <svg
          className="h-7 w-7 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        DevPick
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {"개발자를 위한 맞춤형 학습 플랫폼"}
      </p>
    </div>
  );
}

export function AuthContainer() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "github" | "google") => {
    setLoadingProvider(provider);
    try {
      const getOAuthUrl =
        provider === "github"
          ? authEndpoints.getGithubOAuthUrl
          : authEndpoints.getGoogleOAuthUrl;

      const { data } = await getOAuthUrl();
      window.location.href = data.data.authorizationUrl;
    } catch {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[448px]">
      <DevPickLogo />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5 transition-all duration-300">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="login" className="text-sm font-medium">
              {"로그인"}
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-sm font-medium">
              {"회원가입"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm isLoading={!!loadingProvider} />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">{"또는"}</span>
          </div>
        </div>

        <SocialAuthButtons
          loadingProvider={loadingProvider}
          onSocialLogin={handleSocialLogin}
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {"계속 진행하면 DevPick의 "}
        <button
          type="button"
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {"서비스 이용약관"}
        </button>
        {" 및 "}
        <button
          type="button"
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {"개인정보 처리방침"}
        </button>
        {"에 동의하는 것으로 간주됩니다."}
      </p>
    </div>
  );
}
