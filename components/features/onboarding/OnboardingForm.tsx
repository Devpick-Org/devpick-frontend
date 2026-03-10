"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ProfileNicknameInput } from "@/components/features/profile/ProfileNicknameInput";
import { ProfileRoleSelector } from "@/components/features/profile/ProfileRoleSelector";
import { ProfileLevelSelector } from "@/components/features/profile/ProfileLevelSelector";
import { ProfileTagSelector } from "@/components/features/profile/ProfileTagSelector";
import type { JobRoleId, LevelId } from "@/components/features/profile/constants";

function SectionBadge({ number }: { number: number }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {number}
    </span>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [selectedRole, setSelectedRole] = useState<JobRoleId | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete =
    nickname.trim().length >= 2 &&
    selectedRole !== null &&
    selectedLevel !== null &&
    selectedTags.length > 0;

  const handleSubmit = async () => {
    if (!isComplete) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const payload = {
        nickname: nickname.trim(),
        job: selectedRole,
        level: selectedLevel,
        tags: selectedTags,
      };

      console.log("제출될 데이터:", payload);

      updateUser({
        nickname: payload.nickname,
        jobType: payload.job,
        level: payload.level,
        tags: payload.tags,
      });

      router.push("/home");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          DevPick에 오신 것을 환영합니다!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-balance">
          맞춤형 피드를 위해 정보를 입력해 주세요.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5 md:p-8">
        {/* Section 1: Nickname */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <SectionBadge number={1} />
            <h2 className="text-base font-semibold text-foreground">
              닉네임을 입력해 주세요
            </h2>
          </div>
          <ProfileNicknameInput value={nickname} onChange={setNickname} />
        </div>

        {/* Section 2: Job Role */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <SectionBadge number={2} />
            <h2 className="text-base font-semibold text-foreground">
              직무를 선택해 주세요
            </h2>
          </div>
          <ProfileRoleSelector value={selectedRole} onChange={setSelectedRole} />
        </div>

        {/* Section 3: Experience Level */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <SectionBadge number={3} />
            <h2 className="text-base font-semibold text-foreground">
              경력 수준을 선택해 주세요
            </h2>
          </div>
          <ProfileLevelSelector value={selectedLevel} onChange={setSelectedLevel} />
        </div>

        {/* Section 4: Interest Tags */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <SectionBadge number={4} />
            <h2 className="text-base font-semibold text-foreground">
              관심 기술 태그를 선택해 주세요
            </h2>
          </div>
          <ProfileTagSelector value={selectedTags} onChange={setSelectedTags} />
        </div>

        {/* Submit */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={cn(
            "h-12 w-full text-base font-semibold transition-all duration-200 shadow-md",
            isComplete
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              설정 중...
            </span>
          ) : (
            "DevPick 시작하기"
          )}
        </Button>

        {/* Progress hint */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {[
            nickname.trim().length >= 2,
            selectedRole !== null,
            selectedLevel !== null,
            selectedTags.length > 0,
          ].map((done, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-12 rounded-full transition-colors duration-300",
                done ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
